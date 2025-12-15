// shared/src/store/useAuthStore.ts
import { defineStore } from 'pinia';
import { authService } from '../api/authService';
import { useCourseStore } from './useCourseStore';
import type { User } from '../types';

const storage = {
    getItem(key: string): string | null {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            return null; // NativeScript implementation would go here
        } else {
            return localStorage.getItem(key);
        }
    },

    setItem(key: string, value: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // NativeScript implementation
        } else {
            localStorage.setItem(key, value);
        }
    },

    removeItem(key: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // NativeScript implementation
        } else {
            localStorage.removeItem(key);
        }
    }
};

const TOKEN_STORAGE_KEY = 'auth_token';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null as User | null,
        token: storage.getItem(TOKEN_STORAGE_KEY) || null,
        isLoading: false,
        authError: null as string | null,
    }),

    getters: {
        isLoggedIn: (state) => !!state.user,
    },

    actions: {
        _setAuth(data: { user: User; token: string }) {
            this.user = data.user;
            this.token = data.token;
            storage.setItem(TOKEN_STORAGE_KEY, data.token);
            this.authError = null;

            // [FIX] Sync Active Course Logic
            const courseStore = useCourseStore();
            if (this.user.activeCourseIdentifier) {
                // If user has a preference, set it locally (don't sync back to server loop)
                courseStore.setActiveCourseIdentifier(this.user.activeCourseIdentifier, false);
            } else {
                // If user has NO preference (new user), ensure we clear any local defaults
                courseStore.clearCurrentCourse();
            }
        },

        _clearAuth() {
            this.user = null;
            this.token = null;
            storage.removeItem(TOKEN_STORAGE_KEY);

            // Clear course selection on logout
            const courseStore = useCourseStore();
            courseStore.clearCurrentCourse();
        },

        async register(name: string, email: string, password: string) {
            this.isLoading = true;
            this.authError = null;
            try {
                await authService.register(name, email, password);
            } catch (err: any) {
                this.authError = err.response?.data?.message || 'Registration failed';
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async login(email: string, password: string) {
            this.isLoading = true;
            this.authError = null;
            try {
                const data = await authService.login(email, password);
                this._setAuth(data);
            } catch (err: any) {
                this.authError = err.response?.data?.message || 'Login failed';
                throw err;
            } finally {
                this.isLoading = false;
            }
        },

        async logout() {
            this.isLoading = true;
            try {
                authService.logout().catch(() => { /* ignore errors */ });
            } finally {
                this._clearAuth();
                this.isLoading = false;
            }
        },

        async tryAutoLogin(): Promise<boolean> {
            if (!this.token) {
                return false;
            }

            this.isLoading = true;
            try {
                const user = await authService.getMe();
                this.user = user;

                // [FIX] Sync Active Course Logic on Auto-Login
                const courseStore = useCourseStore();
                if (this.user.activeCourseIdentifier) {
                    courseStore.setActiveCourseIdentifier(this.user.activeCourseIdentifier, false);
                } else {
                    courseStore.clearCurrentCourse();
                }

                return true;
            } catch (err) {
                this._clearAuth();
                return false;
            } finally {
                this.isLoading = false;
            }
        }
    },
});