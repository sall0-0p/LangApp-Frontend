import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@myapp/shared/store/useAuthStore.js';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomeView,
            meta: { requiresAuth: true } // Mark this page as requiring login
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginView,
            meta: { requiresGuest: true } // Mark this page as for "guests"
        }
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isLoggedIn = authStore.isLoggedIn;

    if (to.meta.requiresAuth && !isLoggedIn) {
        next({ name: 'Login' });
    } else if (to.meta.requiresGuest && isLoggedIn) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router;