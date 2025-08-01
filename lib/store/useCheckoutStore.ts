"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type ProductOption = {
  size?: string;
};

type CheckoutItem = {
  id: string;
  quantity: number;
  options?: ProductOption;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
};

type CheckoutStore = {
  request: string;
  receiver: string;
  detailAddress: string;
  checkoutItems: CheckoutItem[];
  setRequest: (v: string) => void;
  setReceiver: (v: string) => void;
  setDetailAddress: (v: string) => void;
  setCheckoutItems: (items: CheckoutItem[]) => void;
  reset: () => void;
};

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      request: "",
      receiver: "",
      detailAddress: "",
      checkoutItems: [],
      setRequest: (v) => set({ request: v }),
      setReceiver: (v) => set({ receiver: v }),
      setDetailAddress: (v) => set({ detailAddress: v }),
      setCheckoutItems: (items) => set({ checkoutItems: items }),
      reset: () =>
        set({
          request: "",
          receiver: "",
          detailAddress: "",
          checkoutItems: [],
        }),
    }),
    {
      name: "checkout",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
