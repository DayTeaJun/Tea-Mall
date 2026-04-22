import { UserType } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user?: UserType | null;
  setUser: (user: UserType | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
