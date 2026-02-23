import { create } from 'zustand'
import { clearStoredToken, getStoredToken, setStoredToken } from '../api/tokenStorage'

export const useAuthStore = create((set) => ({
    user: null,
    token: getStoredToken(),

    setUser: (user) => { set({ user }) },
    setToken: (token) => {
        setStoredToken(token || '');
        set({ token: token || null });
    },
    setAuth: ({ user, token }) => {
        setStoredToken(token || '');
        set({ user: user || null, token: token || null });
    },

    logout: () => {
        clearStoredToken();
        set({ user: null, token: null });
    }
}))
