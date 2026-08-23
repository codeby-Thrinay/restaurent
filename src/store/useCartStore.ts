import { create } from 'zustand';

export interface CartItem {
  id: string; // menuItem.id
  name: string;
  price: number;
  image?: string | null;
  isVeg: boolean;
  quantity: number;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  tableId: string | null;
  tableNumber: number | null;
  setTable: (tableId: string, tableNumber: number) => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  tableId: null,
  tableNumber: null,

  setTable: (tableId, tableNumber) => set({ tableId, tableNumber }),

  addItem: (newItem) => {
    set((state) => {
      const existingIndex = state.items.findIndex((i) => i.id === newItem.id);
      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += 1;
        return { items: updated };
      }
      return { items: [...state.items, { ...newItem, quantity: 1 }] };
    });
  },

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  updateQuantity: (id, delta) =>
    set((state) => {
      const updated = state.items
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      return { items: updated };
    }),

  updateNotes: (id, notes) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, notes } : item)),
    })),

  clearCart: () => set({ items: [] }),

  getTotalCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

  getTotalPrice: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));
