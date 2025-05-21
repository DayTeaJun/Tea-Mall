export type CartItemType = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartStore = {
  items: CartItemType[];
  addToCart: (item: Omit<CartItemType, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
            ),
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: 1 }],
          });
        }
      },

      removeFromCart: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id);
        } else {
          set({
            items: get().items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: "cart-storage",
      skipHydration: true,
    },
  ),
);
