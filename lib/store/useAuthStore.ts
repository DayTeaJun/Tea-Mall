import { UserType } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user?: UserType | null;
  isDeliveryVerified: boolean;
  setUser: (user: UserType | null) => void;
  setDeliveryVerified: (verified: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  isDeliveryVerified: false,
  setUser: (user) => set({ user }),
  setDeliveryVerified: (verified) => set({ isDeliveryVerified: verified }),
}));
