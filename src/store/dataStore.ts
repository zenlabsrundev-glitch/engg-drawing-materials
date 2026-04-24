import { create } from 'zustand';
import { User, Kit, Order } from '../types';
import { generateMockUsers, SAMPLE_KITS, generateMockOrders } from '../utils/mockData';

interface DataStore {
  users: User[];
  kits: Kit[];
  orders: Order[];
  archivedOrders: Order[];
  initData: () => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  archiveOrder: (orderId: string) => void;
  addUser: (user: User) => void;
  updateUserInStore: (userId: string, updates: Partial<User>) => void;
  addKit: (kit: Kit) => void;
  updateKit: (kit: Kit) => void;
  deleteKit: (kitId: string) => void;
  deleteUser: (userId: string) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  users: [],
  kits: SAMPLE_KITS,
  orders: [],
  archivedOrders: [],
  
  initData: () => {
    const mockUsers = generateMockUsers(1000);
    const mockOrders = generateMockOrders(mockUsers, 50);
    set({ users: mockUsers, orders: mockOrders });
  },
  
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
  })),

  archiveOrder: (orderId) => set((state) => {
    const orderToArchive = state.orders.find(o => o.id === orderId);
    if (!orderToArchive) return state;
    return {
      orders: state.orders.filter(o => o.id !== orderId),
      archivedOrders: [orderToArchive, ...state.archivedOrders]
    };
  }),

  addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
  
  updateUserInStore: (userId, updates) => set((state) => ({
    users: state.users.map(u => u.id === userId ? { ...u, ...updates } : u)
  })),

  addKit: (kit) => set((state) => ({ kits: [kit, ...state.kits] })),

  updateKit: (kit) => set((state) => ({
    kits: state.kits.map(k => k.id === kit.id ? kit : k)
  })),

  deleteKit: (kitId) => set((state) => ({
    kits: state.kits.filter(k => k.id !== kitId)
  })),

  deleteUser: (userId) => set((state) => ({
    users: state.users.filter(u => u.id !== userId)
  })),
}));
