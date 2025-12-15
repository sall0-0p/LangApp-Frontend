// shared/src/store/useAuthStore.ts
import { defineStore } from 'pinia';
import { authService } from '../api/authService';
// [FIX] Import CourseStore to sync state
import { useCourseStore } from './useCourseStore';
import type { User } from '../types';

const storage = {
    getItem(key: string): string | null {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // NativeScript logic...
            return null;
        } else {
            return localStorage.getItem(key);
        }
    },

    setItem(key: string, value: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // NativeScript logic...
        } else {
            localStorage.setItem(key, value);
        }
    },

    removeItem(key: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // NativeScript logic...
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

            // [FIX] Sync the user's active course to the CourseStore immediately
            if (this.user.activeCourseIdentifier) {
                const courseStore = useCourseStore();
                courseStore.setActiveCourseIdentifier(this.user.activeCourseIdentifier, false); // false = don't sync back to server
            }
        },

        _clearAuth() {
            this.user = null;
            this.token = null;
            storage.removeItem(TOKEN_STORAGE_KEY);
            // [FIX] Clear course selection on logout
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

                // [FIX] Sync the user's active course to the CourseStore on auto-login
                if (this.user.activeCourseIdentifier) {
                    const courseStore = useCourseStore();
                    courseStore.setActiveCourseIdentifier(this.user.activeCourseIdentifier, false);
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