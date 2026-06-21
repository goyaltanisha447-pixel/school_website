import { create } from 'zustand';
import { api } from '../utils/api';
import { useAuthStore } from './authStore';

export const useCartStore = create((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),

  fetchCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) {
      // Load from localStorage if logged out
      const localCart = localStorage.getItem('dtc_local_cart');
      if (localCart) {
        set({ items: JSON.parse(localCart) });
      }
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const data = await api.get('/cart');
      set({ items: data.items || [], isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  addItem: async (product, quantity = 1) => {
    const { isAuthenticated } = useAuthStore.getState();
    
    if (!isAuthenticated) {
      // Local cart handling
      const currentItems = [...get().items];
      const existingIndex = currentItems.findIndex(item => item.productId === product.id);

      if (existingIndex > -1) {
        currentItems[existingIndex].quantity += quantity;
      } else {
        currentItems.push({
          id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          productId: product.id,
          quantity,
          product: {
            ...product,
            images: Array.isArray(product.images) ? product.images : product.images.split(','),
          }
        });
      }
      
      localStorage.setItem('dtc_local_cart', JSON.stringify(currentItems));
      set({ items: currentItems });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await api.post('/cart/add', { productId: product.id, quantity });
      // Refresh cart
      const data = await api.get('/cart');
      set({ items: data.items || [], isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  updateQuantity: async (cartItemId, quantity) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      const currentItems = get().items.map(item => {
        if (item.id === cartItemId) {
          return { ...item, quantity };
        }
        return item;
      }).filter(item => item.quantity > 0);

      localStorage.setItem('dtc_local_cart', JSON.stringify(currentItems));
      set({ items: currentItems });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await api.put('/cart/update', { cartItemId, quantity });
      const data = await api.get('/cart');
      set({ items: data.items || [], isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  removeItem: async (cartItemId) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      const currentItems = get().items.filter(item => item.id !== cartItemId);
      localStorage.setItem('dtc_local_cart', JSON.stringify(currentItems));
      set({ items: currentItems });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      await api.delete('/cart/remove', { cartItemId });
      const data = await api.get('/cart');
      set({ items: data.items || [], isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  clearCart: () => {
    localStorage.removeItem('dtc_local_cart');
    set({ items: [] });
  },

  // Sync local cart to backend after logging in
  syncCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    const localItems = JSON.parse(localStorage.getItem('dtc_local_cart') || '[]');
    if (localItems.length === 0) {
      // Just fetch backend cart
      await get().fetchCart();
      return;
    }

    set({ isLoading: true });
    try {
      // Add each local item to backend cart
      for (const item of localItems) {
        await api.post('/cart/add', { productId: item.productId, quantity: item.quantity });
      }
      
      // Clear local cart
      localStorage.removeItem('dtc_local_cart');
      
      // Fetch fresh cart from database
      const data = await api.get('/cart');
      set({ items: data.items || [], isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  getTotalAmount: () => {
    return get().items.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  }
}));
