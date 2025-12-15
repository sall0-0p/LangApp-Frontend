// shared/src/api/authService.ts
import apiClient from './apiClient';
import type { AuthResponse, User } from "../types";

export const authService = {
    register(username: string, email: string, password: string): Promise<AuthResponse> {
        const payload = { username, email, password };
        return apiClient.post<AuthResponse>('/auth/register', payload).then(res => res.data);
    },

    login(usernameOrEmail: string, password: string): Promise<AuthResponse> {
        const payload = { usernameOrEmail, password };
        return apiClient.post<AuthResponse>('/auth/login', payload).then(res => res.data);
    },

    logout(): Promise<void> {
        return apiClient.post<void>('/auth/logout').then(res => res.data);
    },

    getMe(): Promise<User> {
        return apiClient.get<User>('/auth/me').then(res => res.data);
    },

    updateMe(data: Partial<User>): Promise<User> {
        return apiClient.patch<User>('/auth/me', data).then(res => res.data);
    }
}