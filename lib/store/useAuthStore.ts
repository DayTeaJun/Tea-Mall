// lib/store/useAuthStore.ts
import { create } from "zustand";

type User = {
  id: string;
  email: string;
};

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
