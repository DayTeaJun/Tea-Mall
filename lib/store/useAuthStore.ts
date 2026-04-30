import { UserType } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user?: UserType | null;
  isVerified: boolean;
  verifiedAt: number | null;
  setUser: (user: UserType | null) => void;
  setVerified: (verified: boolean) => void;
  checkIsExpired: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  isVerified: false,
  verifiedAt: null,

  setUser: (user) => set({ user }),
  setVerified: (verified) =>
    set({
      isVerified: verified,
      verifiedAt: verified ? Date.now() : null,
    }),

  checkIsExpired: () => {
    const { isVerified, verifiedAt } = get();
    if (!isVerified || !verifiedAt) return true;

    const EXPIRE_TIME = 5 * 60 * 1000; // 5분
    return Date.now() - verifiedAt > EXPIRE_TIME;
  },
}));
