import { defineStore } from 'pinia';
import { authService } from '../api/authService';
import type { User } from '../types';

interface IApplicationSettings {
    setString(key: string, value: string): void;
    getString(key: string): string | undefined; // getString returns undefined if not found
    remove(key: string): void;
}

const storage = {
    getItem(key: string): string | null {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
                // const ApplicationSettings = require('@nativescript/core').ApplicationSettings;
            // return ApplicationSettings.getString(key) || null;
            return 'Hello World!';
        } else {
            return localStorage.getItem(key);
        }
    },

    setItem(key: string, value: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // const ApplicationSettings = require('@nativescript/core').ApplicationSettings;
            // ApplicationSettings.setString(key, value);
            return 'Hello World!';
        } else {
            localStorage.setItem(key, value);
        }
    },

    removeItem(key: string) {
        // @ts-ignore
        if (typeof global !== 'undefined' && (global.isIOS || global.isAndroid)) {
            // const ApplicationSettings = require('@nativescript/core').ApplicationSettings;
            // ApplicationSettings.remove(key);
            return 'Hello World!';
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
        // This action commits the user and token to state AND storage
        _setAuth(data: { user: User; token: string }) {
            this.user = data.user;
            this.token = data.token;
            storage.setItem(TOKEN_STORAGE_KEY, data.token);
            this.authError = null;
        },

        // This action clears all auth state and storage
        _clearAuth() {
            this.user = null;
            this.token = null;
            storage.removeItem(TOKEN_STORAGE_KEY);
        },

        async register(name: string, email: string, password: string) {
            this.isLoading = true;
            this.authError = null;
            try {
                await authService.register(name, email, password);
            } catch (err: any) {
                this.authError = err.response?.data?.message || 'Registration failed';
                throw err; // Re-throw for the component to handle
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
                throw err; // Re-throw for the component to handle
            } finally {
                this.isLoading = false;
            }
        },

        async logout() {
            this.isLoading = true;
            try {
                // We call the logout endpoint, but we don't
                // wait for it. We log the user out on the client *immediately*.
                authService.logout().catch(() => { /* ignore errors */ });
            } finally {
                this._clearAuth();
                this.isLoading = false;
            }
        },

        // This is the critical function for app startup
        async tryAutoLogin(): Promise<boolean> {
            if (!this.token) {
                return false; // No token, no-go
            }

            this.isLoading = true;
            try {
                // Use the token to fetch the user's profile
                const user = await authService.getMe();
                // Token is valid! Set the user.
                this.user = user;
                return true;
            } catch (err) {
                // Token was invalid (e.g., expired)
                this._clearAuth(); // Clear the bad token
                return false;
            } finally {
                this.isLoading = false;
            }
        }
    },
});