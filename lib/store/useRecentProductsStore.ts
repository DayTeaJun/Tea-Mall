import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentProduct {
  id: string;
  src: string;
  alt: string;
}

interface RecentProductsState {
  recentProducts: RecentProduct[];
  addProduct: (product: RecentProduct) => void;
}

export const useRecentProductsStore = create<RecentProductsState>()(
  persist(
    (set) => ({
      recentProducts: [],

      addProduct: (product) =>
        set((state) => {
          const filtered = state.recentProducts.filter(
            (p) => p.id !== product.id,
          );
          const updated = [product, ...filtered].slice(0, 6);
          return { recentProducts: updated };
        }),
    }),
    {
      name: "recent_products_storage",
    },
  ),
);
