import { createApp } from 'vue';
import { createPinia } from 'pinia';

// @ts-ignore
import { useAuthStore } from '@myapp/shared/store/useAuthStore.ts';

// @ts-ignore
import App from './App.vue';
// @ts-ignore
import router from './router';

import './style.css';

async function startApp() {
    const app = createApp(App);
    const pinia = createPinia();

    app.use(pinia);

    const authStore = useAuthStore();

    try {
        await authStore.tryAutoLogin();
    } catch (err) {
        console.error('Failed to auto-login', err);
    }

    app.use(router);
    app.mount('#app');
}

startApp();