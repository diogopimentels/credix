import { create } from 'zustand';

interface AuthState {
    isAuthenticated: boolean;
    user: { name: string; role: string; email: string } | null;
    login: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    login: () => set({ isAuthenticated: true, user: { name: 'Credor Exemplo', role: 'admin', email: 'admin@credimestre.com' } }),
    logout: () => set({ isAuthenticated: false, user: null }),
}));
