import { create } from 'zustand';

export const useToastStore = create((set, get) => ({
  toasts: [],
  
  addToast: (message, type = 'success') => {
    const id = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { id, message, type };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));

    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  }
}));
