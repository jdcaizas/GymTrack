<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../api';
import { setSession } from '../auth';

const router = useRouter();
const mode = ref('login'); // 'login' o 'register'
const form = ref({ name: '', email: '', cedula: '', password: '' });
const error = ref('');
const loading = ref(false);

// Solo permite números en el input de la cédula (comodidad del usuario).
// La validación REAL se hace en el back-end.
function soloNumeros() {
  form.value.cedula = form.value.cedula.replace(/\D/g, '');
}

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    const path = mode.value === 'login' ? '/auth/login' : '/auth/register';
    const body =
      mode.value === 'login'
        ? { email: form.value.email, password: form.value.password }
        : { ...form.value };
    const data = await api(path, { method: 'POST', body });
    setSession(data); // guarda token y usuario
    router.push('/ejercicios');
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}

function toggle() {
  mode.value = mode.value === 'login' ? 'register' : 'login';
  error.value = '';
}
</script>

<template>
  <div class="auth-wrap">
    <form class="auth-card" @submit.prevent="submit">
      <div class="brand">Gym<span>Track</span></div>
      <h1>{{ mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta' }}</h1>
      <p class="sub">
        {{ mode === 'login' ? 'Inicia sesión para ver tus ejercicios.' : 'Regístrate para empezar a registrar tu progreso.' }}
      </p>

      <div v-if="error" class="alert error">{{ error }}</div>

      <div v-if="mode === 'register'" class="field">
        <label>Nombre</label>
        <input v-model="form.name" placeholder="Tu nombre" required />
      </div>
      <div class="field">
        <label>Correo</label>
        <input v-model="form.email" type="email" placeholder="tu@correo.com" required />
      </div>

      <!-- NUEVO: cédula, solo en modo registro -->
      <div v-if="mode === 'register'" class="field">
        <label>Cédula</label>
        <input
          v-model="form.cedula"
          @input="soloNumeros"
          inputmode="numeric"
          maxlength="10"
          placeholder="10 dígitos"
          required
        />
      </div>

      <div class="field">
        <label>Contraseña</label>
        <input v-model="form.password" type="password" placeholder="Mínimo 6 caracteres" required />
      </div>

      <button class="btn" :disabled="loading">
        {{ loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta' }}
      </button>

      <p class="switch">
        {{ mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?' }}
        <button type="button" @click="toggle">{{ mode === 'login' ? 'Regístrate' : 'Inicia sesión' }}</button>
      </p>
    </form>
  </div>
</template>