import { session, clearSession } from './auth';
import router from './router';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function api(path, { method = 'GET', body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      // Si hay sesión, el token viaja en cada petición
      ...(session.token ? { Authorization: `Bearer ${session.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Token vencido o inválido: se cierra la sesión y vuelve al login
  if (res.status === 401 && !path.startsWith('/auth/')) {
    clearSession();
    router.push('/login');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = Array.isArray(data.message) ? data.message.join('. ') : data.message;
    throw new Error(msg || 'Error en el servidor');
  }
  return data;
}