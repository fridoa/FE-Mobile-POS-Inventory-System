import { IProduct } from "@/types/Product";
import { create } from "zustand";

export interface CartItem extends IProduct {
  qty: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (product: IProduct) => void;
  updateQty: (itemId: string, delta: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalQty: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],

  addToCart: (product) =>
    set((state) => {
      const productId = product._id;
      const existing = state.cart.find((item) => item._id === productId);

      if (existing) {
        return {
          cart: state.cart.map((item) => (item._id === productId ? { ...item, qty: item.qty + 1 } : item)),
        };
      }
      return { cart: [...state.cart, { ...product, qty: 1 }] };
    }),

  updateQty: (itemId, delta) =>
    set((state) => ({
      cart: state.cart
        .map((item) => {
          if (item._id === itemId) {
            return { ...item, qty: Math.max(0, item.qty + delta) };
          }
          return item;
        })
        .filter((item) => item.qty > 0),
    })),

  clearCart: () => set({ cart: [] }),

  getTotalPrice: () => {
    return get().cart.reduce((sum, item) => {
      const originalPrice = Number(item.price) || 0;
      const discountPercent = Number(item.discount) || 0;

      const finalPrice = originalPrice - (originalPrice * discountPercent) / 100;

      return sum + finalPrice * item.qty;
    }, 0);
  },

  getTotalQty: () => get().cart.reduce((sum, item) => sum + item.qty, 0),
}));
