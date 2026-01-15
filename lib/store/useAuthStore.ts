import { create } from "zustand";

export type AuthUser = {
  id: string;
  email: string;
  user_name: string;
  level: number;
  phone: string;
  address: string;

  app_metadata?: {
    provider?: "email" | string;
  };
};

interface AuthState {
  user?: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
