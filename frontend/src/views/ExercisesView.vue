<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';
import { session, clearSession } from '../auth';

const router = useRouter();
const items = ref([]);
const error = ref('');
const showModal = ref(false);
const editingId = ref(null); // null = creando, número = editando ese id
const saving = ref(false);

// Catálogo para los dropdowns dependientes
const groups = ref([]);
const muscles = ref([]);

const emptyForm = () => ({ name: '', groupId: '', muscleId: '', sets: 3, reps: 10, weightKg: 0, notes: '' });
const form = ref(emptyForm());

// Valores calculados: se recalculan solos cuando cambia la lista
const totalSets = computed(() => items.value.reduce((a, e) => a + e.sets, 0));
const groupCount = computed(() => new Set(items.value.map((e) => e.muscle?.group?.id)).size);
const initial = computed(() => (session.user?.name || '?').charAt(0).toUpperCase());

// LEER
async function load() {
  try {
    items.value = await api('/exercises');
  } catch (e) {
    error.value = e.message;
  }
}

// Primer dropdown: grupos musculares
async function loadGroups() {
  try {
    groups.value = await api('/catalog/groups');
  } catch (e) {
    error.value = e.message;
  }
}

// Segundo dropdown: músculos del grupo elegido
async function loadMuscles(groupId) {
  muscles.value = groupId ? await api(`/catalog/groups/${groupId}/muscles`) : [];
}

// Cuando el usuario cambia de grupo: se limpia el músculo y se recargan las opciones
async function onGroupChange() {
  form.value.muscleId = '';
  try {
    await loadMuscles(form.value.groupId);
  } catch (e) {
    error.value = e.message;
  }
}

function openCreate() {
  editingId.value = null;
  form.value = emptyForm();
  muscles.value = [];
  error.value = '';
  showModal.value = true;
}

async function openEdit(item) {
  editingId.value = item.id;
  form.value = {
    name: item.name,
    groupId: item.muscle.group.id,
    muscleId: item.muscle.id,
    sets: item.sets,
    reps: item.reps,
    weightKg: item.weightKg,
    notes: item.notes || '',
  };
  error.value = '';
  showModal.value = true;
  await loadMuscles(item.muscle.group.id); // carga los músculos de su grupo
}

// CREAR o ACTUALIZAR, según editingId
async function save() {
  saving.value = true;
  error.value = '';
  try {
    // groupId solo sirve para el dropdown; al servidor se envía únicamente muscleId
    const body = {
      name: form.value.name,
      muscleId: Number(form.value.muscleId),
      sets: Number(form.value.sets),
      reps: Number(form.value.reps),
      weightKg: Number(form.value.weightKg),
      notes: form.value.notes,
    };
    if (editingId.value) {
      await api(`/exercises/${editingId.value}`, { method: 'PUT', body });
    } else {
      await api('/exercises', { method: 'POST', body });
    }
    showModal.value = false;
    await load(); // vuelve a pedir la lista para mostrar los cambios
  } catch (e) {
    error.value = e.message;
  } finally {
    saving.value = false;
  }
}

// ELIMINAR
async function remove(item) {
  if (!confirm(`¿Eliminar "${item.name}"?`)) return;
  try {
    await api(`/exercises/${item.id}`, { method: 'DELETE' });
    await load();
  } catch (e) {
    error.value = e.message;
  }
}

function logout() {
  clearSession();
  router.push('/login');
}

// Al abrir la pantalla, carga los ejercicios y los grupos
onMounted(() => {
  load();
  loadGroups();
});
</script>

<template>
  <header class="topbar">
    <div class="brand">Gym<span>Track</span></div>
    <div class="user">
      <div class="avatar">{{ initial }}</div>
      <span>{{ session.user?.name }}</span>
      <button class="btn ghost small" @click="logout">Cerrar sesión</button>
    </div>
  </header>

  <main class="container">
    <div class="head">
      <div>
        <h2>Biblioteca de ejercicios</h2>
        <p>Crea, edita y organiza tus ejercicios. Solo tú puedes verlos.</p>
      </div>
      <button class="btn" @click="openCreate">+ Nuevo ejercicio</button>
    </div>

    <div v-if="error && !showModal" class="alert error">{{ error }}</div>

    <section class="stats">
      <div class="stat"><div class="n">{{ items.length }}</div><div class="l">Ejercicios</div></div>
      <div class="stat"><div class="n">{{ groupCount }}</div><div class="l">Grupos musculares</div></div>
      <div class="stat"><div class="n">{{ totalSets }}</div><div class="l">Series totales</div></div>
    </section>

    <div v-if="!items.length" class="empty">
      <h3>Aún no tienes ejercicios</h3>
      <p>Pulsa “Nuevo ejercicio” para crear el primero.</p>
    </div>

    <section v-else class="grid">
      <article v-for="e in items" :key="e.id" class="card">
        <span class="tag">{{ e.muscle?.group?.name }} · {{ e.muscle?.name }}</span>
        <h3>{{ e.name }}</h3>
        <div class="metrics">
          <div class="metric"><b>{{ e.sets }}</b><span>Series</span></div>
          <div class="metric"><b>{{ e.reps }}</b><span>Reps</span></div>
          <div class="metric"><b>{{ e.weightKg }}</b><span>Kg</span></div>
        </div>
        <p class="notes">{{ e.notes || 'Sin notas' }}</p>
        <div class="actions">
          <button class="btn ghost small" @click="openEdit(e)">Editar</button>
          <button class="btn danger small" @click="remove(e)">Eliminar</button>
        </div>
      </article>
    </section>
  </main>

  <!-- Ventana para crear / editar -->
  <div v-if="showModal" class="overlay" @click.self="showModal = false">
    <form class="modal" @submit.prevent="save">
      <h3>{{ editingId ? 'Editar ejercicio' : 'Nuevo ejercicio' }}</h3>
      <div v-if="error" class="alert error">{{ error }}</div>

      <div class="field">
        <label>Nombre</label>
        <input v-model="form.name" placeholder="Ej: Press de banca" required />
      </div>

      <!-- DROPDOWN 1: grupo muscular -->
      <div class="field">
        <label>Grupo muscular</label>
        <select v-model="form.groupId" @change="onGroupChange" required>
          <option value="" disabled>Selecciona un grupo</option>
          <option v-for="g in groups" :key="g.id" :value="g.id">{{ g.name }}</option>
        </select>
      </div>

      <!-- DROPDOWN 2: músculo (depende del grupo elegido) -->
      <div class="field">
        <label>Músculo</label>
        <select v-model="form.muscleId" :disabled="!form.groupId" required>
          <option value="" disabled>
            {{ form.groupId ? 'Selecciona un músculo' : 'Primero elige un grupo' }}
          </option>
          <option v-for="m in muscles" :key="m.id" :value="m.id">{{ m.name }}</option>
        </select>
      </div>

      <div class="row">
        <div class="field"><label>Series</label><input v-model="form.sets" type="number" min="1" max="50" required /></div>
        <div class="field"><label>Reps</label><input v-model="form.reps" type="number" min="1" max="200" required /></div>
        <div class="field"><label>Peso (kg)</label><input v-model="form.weightKg" type="number" min="0" step="0.5" required /></div>
      </div>
      <div class="field">
        <label>Notas</label>
        <textarea v-model="form.notes" placeholder="Opcional"></textarea>
      </div>

      <div class="modal-actions">
        <button type="button" class="btn ghost" @click="showModal = false">Cancelar</button>
        <button class="btn" :disabled="saving">{{ saving ? 'Guardando...' : 'Guardar' }}</button>
      </div>
    </form>
  </div>
</template>