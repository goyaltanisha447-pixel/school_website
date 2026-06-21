import { create } from 'zustand';
import { api } from '../utils/api';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('dtc_user') || 'null'),
  accessToken: localStorage.getItem('dtc_access_token') || null,
  refreshToken: localStorage.getItem('dtc_refresh_token') || null,
  isAuthenticated: !!localStorage.getItem('dtc_access_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post('/auth/login', { email, password });
      
      localStorage.setItem('dtc_user', JSON.stringify(data.user));
      localStorage.setItem('dtc_access_token', data.accessToken);
      localStorage.setItem('dtc_refresh_token', data.refreshToken);

      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return data.user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  register: async (name, email, phone, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.post('/auth/register', { name, email, phone, password });
      
      localStorage.setItem('dtc_user', JSON.stringify(data.user));
      localStorage.setItem('dtc_access_token', data.accessToken);
      localStorage.setItem('dtc_refresh_token', data.refreshToken);

      set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return data.user;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout', {});
    } catch (e) {
      console.error('Logout request failed', e);
    }
    
    localStorage.removeItem('dtc_user');
    localStorage.removeItem('dtc_access_token');
    localStorage.removeItem('dtc_refresh_token');

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      error: null,
    });
  },

  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      // profileData can contain { name, phone, addresses }
      const updatedUser = await api.put('/auth/profile', profileData);
      localStorage.setItem('dtc_user', JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
      return updatedUser;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

// Listen to force logout events from the API client interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('auth-logout', () => {
    useAuthStore.getState().logout();
  });
}
