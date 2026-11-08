import { createRouter, createWebHistory } from 'vue-router';
import { session } from './auth';
import LoginView from './views/LoginView.vue';
import ExercisesView from './views/ExercisesView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/ejercicios' },
    { path: '/login', component: LoginView },
    // meta.requiresAuth marca las pantallas que necesitan sesión
    { path: '/ejercicios', component: ExercisesView, meta: { requiresAuth: true } },
  ],
});

// Se ejecuta antes de cada cambio de pantalla
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !session.token) return '/login';
  if (to.path === '/login' && session.token) return '/ejercicios';
});

export default router;