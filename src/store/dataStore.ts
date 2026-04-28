import { create } from 'zustand';
import { User, Kit, Order } from '../types';
import api from '../services/api';
// No direct import here to avoid circular dependency with api.ts

interface DataStore {
  users: User[];
  kits: Kit[];
  orders: Order[];
  archivedOrders: Order[];
  isLoading: boolean;
  initData: (role: string, user: User | null) => Promise<void>;
  fetchKits: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchOrders: (role: string, user: User | null) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  archiveOrder: (orderId: string) => Promise<void>;
  addUser: (user: User) => void;
  updateUserInStore: (userId: string, updates: Partial<User>) => void;
  addKit: (kit: Kit) => Promise<void>;
  updateKit: (kit: Kit) => Promise<void>;
  deleteKit: (kitId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

export const useDataStore = create<DataStore>((set, get) => ({
  users: [],
  kits: [],
  orders: [],
  archivedOrders: [],
  isLoading: false,
  
  initData: async (role, user) => {
    if (!role) return;

    set({ isLoading: true });
    try {
      const tasks = [get().fetchKits()];
      
      if (role === 'admin') {
        tasks.push(get().fetchUsers());
        tasks.push(get().fetchOrders(role, user));
      } else if (role === 'student' && user) {
        tasks.push(get().fetchOrders(role, user));
      }

      await Promise.all(tasks);
    } catch (error) {
      console.error('Failed to initialize data:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchKits: async () => {
    try {
      const response = await api.get('/kits');
      set({ kits: response.data });
    } catch (error) {
      console.error('Failed to fetch kits:', error);
    }
  },

  fetchUsers: async () => {
    try {
      const response = await api.get('/users');
      set({ users: response.data });
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  },

  fetchOrders: async (role, user) => {
    try {
      let response;
      if (role === 'admin') {
        response = await api.get('/orders');
      } else if (role === 'student' && user) {
        response = await api.get(`/orders/user/${user.id}`);
      } else {
        return;
      }
      set({ orders: response.data });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  },
  
  addOrder: async (order) => {
    try {
      const response = await api.post('/orders', order);
      set((state) => ({ orders: [response.data, ...state.orders] }));
    } catch (error) {
      console.error('Failed to add order:', error);
      throw error;
    }
  },
  
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/orders/${orderId}/status`, { status });
      set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? response.data : o)
      }));
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },



  archiveOrder: async (orderId) => {
    try {
      // Assuming archiving is just deleting from the active view for now, 
      // or we can implement a real archive endpoint if the backend supports it.
      // For now, we simulate archive by removing it locally. (If your backend has DELETE /orders/:id, call it here)
      set((state) => {
        const orderToArchive = state.orders.find(o => o.id === orderId);
        if (!orderToArchive) return state;
        return {
          orders: state.orders.filter(o => o.id !== orderId),
          archivedOrders: [orderToArchive, ...state.archivedOrders]
        };
      });
    } catch (error) {
      console.error('Failed to archive order:', error);
      throw error;
    }
  },

  addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
  
  updateUserInStore: (userId, updates) => set((state) => ({
    users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u)
  })),

  addKit: async (kit) => {
    try {
      const response = await api.post('/kits', kit);
      set((state) => ({ kits: [response.data, ...state.kits] }));
    } catch (error) {
      console.error('Failed to add kit:', error);
      throw error;
    }
  },

  updateKit: async (kit) => {
    try {
      const response = await api.put(`/kits/${kit.id}`, kit);
      set((state) => ({
        kits: state.kits.map(k => k.id === kit.id ? response.data : k)
      }));
    } catch (error) {
      console.error('Failed to update kit:', error);
      throw error;
    }
  },

  deleteKit: async (kitId) => {
    try {
      await api.delete(`/kits/${kitId}`);
      set((state) => ({
        kits: state.kits.filter(k => k.id !== kitId)
      }));
    } catch (error) {
      console.error('Failed to delete kit:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      set((state) => ({
        users: state.users.filter(u => u.id !== userId)
      }));
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  },
}));
