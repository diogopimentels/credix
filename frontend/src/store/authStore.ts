import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    isAuthenticated: boolean;
    user: { name: string; role: string; email: string } | null;
    login: (email: string, pass: string) => boolean;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            user: null,
            login: (email, password) => {
                if (email === 'admin@credix.com' && password === 'admin') {
                    set({ isAuthenticated: true, user: { name: 'Admin', role: 'admin', email: 'admin@credix.com' } });
                    return true;
                }
                return false;
            },
            logout: () => set({ isAuthenticated: false, user: null }),
        }),
        {
            name: 'auth-storage', // unique name for localStorage key
        }
    )
);
