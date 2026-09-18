import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Modifier {
  id: number;
  name: string;
  price: string | number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  image?: string;
  modifiers: Modifier[];
}

export interface CartItem {
  id: string; // Unique ID for the cart (productId + selected modifiers could work, or just random UUID)
  product: Product;
  quantity: number;
  selectedModifiers: Modifier[];
  unitPrice: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
  items: [],
  addItem: (item) => {
    set((state) => {
      // If exactly the same item (product + same modifiers + same notes) exists, increment quantity
      const existingItem = state.items.find(i => 
        i.product.id === item.product.id && 
        JSON.stringify(i.selectedModifiers.map(m => m.id).sort()) === JSON.stringify(item.selectedModifiers.map(m => m.id).sort()) &&
        i.notes === item.notes
      );

      if (existingItem) {
        return {
          items: state.items.map(i => 
            i.id === existingItem.id 
              ? { ...i, quantity: Math.min(6, i.quantity + item.quantity) } 
              : i
          )
        };
      }
      
      return { items: [...state.items, item] };
    });
  },
  removeItem: (id) => {
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
  },
  updateQuantity: (id, quantity) => {
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  },
}),
    {
      name: 'burgersosa-cart',
    }
  )
);
