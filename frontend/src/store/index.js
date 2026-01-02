import { create } from 'zustand';
import api from '../api/client';

export const useStore = create((set) => ({
    user: null,
    courses: [],
    learningPaths: [],
    mySkills: [],
    isLoading: false,
    error: null,
    achievements: { badges: [], certificates: [] },

    fetchDashboard: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/api/dashboard');
            set({
                user: response.data.user,
                courses: response.data.courses,
                learningPaths: response.data.learningPaths,
                isLoading: false
            });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    fetchAchievements: async () => {
        try {
            const response = await api.get('/api/users/me/achievements');
            set({ achievements: response.data });
        } catch (error) {
            console.error(error);
        }
    },

    fetchMySkills: async () => {
        try {
            const response = await api.get('/api/skills/me');
            set({ mySkills: response.data });
        } catch (error) {
            console.error(error);
        }
    },

    setUser: (user) => set({ user }),
    login: (user) => set({ user }),
    logout: () => set({ user: null }),
}));
