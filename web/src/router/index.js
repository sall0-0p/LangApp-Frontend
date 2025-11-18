import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@myapp/shared/store/useAuthStore.js';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from "@/views/RegisterView.vue";
import AppLayout from "@/components/app/AppLayout.vue";
import LessonSessionView from "@/views/LessonSessionView.vue";

const TITLE_PREFIX = 'LangApp';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: '',
                    name: 'Home',
                    component: HomeView,
                    meta: {
                        title: 'Home'
                    }
                },
            ]
        },
        {
            path: '/learn/:id',
            name: "Learn",
            component: LessonSessionView,
            meta: {
                title: 'Learn',
                requiresAuth: true,
            }
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginView,
            meta: {
                title: 'Login',
                requiresGuest: true
            }
        },
        {
            path: '/register',
            name: 'Register',
            component: RegisterView,
            meta: {
                title: 'Register',
                requiresGuest: true
            }
        },
    ]
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const isLoggedIn = !!authStore.token;

    if (to.meta.requiresAuth && !isLoggedIn) {
        next({ name: 'Login' });
    } else if (to.meta.requiresGuest && isLoggedIn) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

router.beforeEach((to, from, next) => {
    const title = ': ' + to.meta.title || '';
    document.title = TITLE_PREFIX + title;
    next();
})

export default router;