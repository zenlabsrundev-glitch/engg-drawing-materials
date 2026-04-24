import { create } from 'zustand';
import { Kit, OrderItem } from '../types';

interface CartStore {
  items: OrderItem[];
  addItem: (kit: Kit) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  
  addItem: (kit) => {
    const items = get().items;
    const existing = items.find(i => i.kitId === kit.id);
    
    if (existing) {
      const newItems = items.map(i => 
        i.kitId === kit.id ? { ...i, quantity: i.quantity + 1 } : i
      );
      set({ items: newItems, total: get().total + kit.price });
    } else {
      const newItem: OrderItem = {
        id: Math.random().toString(36).substr(2, 9),
        kitId: kit.id,
        kitName: kit.name,
        price: kit.price,
        quantity: 1,
        image: kit.image
      };
      set({ items: [...items, newItem], total: get().total + kit.price });
    }
  },
  
  updateQuantity: (itemId, delta) => {
    const items = get().items;
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    const quantityDiff = newQuantity - item.quantity;

    if (quantityDiff === 0) return;

    const newItems = items.map(i => 
      i.id === itemId ? { ...i, quantity: newQuantity } : i
    );

    set({ 
      items: newItems, 
      total: get().total + (item.price * quantityDiff) 
    });
  },

  removeItem: (itemId) => {
    const item = get().items.find(i => i.id === itemId);
    if (!item) return;
    set({
      items: get().items.filter(i => i.id !== itemId),
      total: get().total - (item.price * item.quantity)
    });
  },
  
  clearCart: () => set({ items: [], total: 0 }),
}));
