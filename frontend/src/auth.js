import { reactive } from 'vue';

// Lee la sesión guardada, para que no se pierda al recargar la página
const saved = JSON.parse(localStorage.getItem('gt_session') || 'null');

// reactive: si esto cambia, las pantallas que lo usan se actualizan solas
export const session = reactive({
  token: saved?.token || null,
  user: saved?.user || null,
});

export function setSession(data) {
  session.token = data.token;
  session.user = data.user;
  localStorage.setItem('gt_session', JSON.stringify(data));
}

export function clearSession() {
  session.token = null;
  session.user = null;
  localStorage.removeItem('gt_session');
}