import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from "../store/useAuthStore";

const apiClient: AxiosInstance = axios.create({
    baseURL: 'http://langapp.lordbucket.eu/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use((config) => {
    const authStore = useAuthStore();

    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
})

export default apiClient;