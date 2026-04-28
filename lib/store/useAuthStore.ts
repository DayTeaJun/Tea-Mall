import { UserType } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user?: UserType | null;
  isVerified: boolean;
  verifiedAt: number | null;
  setUser: (user: UserType | null) => void;
  setVerified: (verified: boolean) => void;
  getIsVerified: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  isVerified: false,
  verifiedAt: null,

  setUser: (user) => set({ user }),

  setVerified: (verified) => {
    set({
      isVerified: verified,
      verifiedAt: verified ? Date.now() : null,
    });
  },

  getIsVerified: () => {
    const { isVerified, verifiedAt } = get();
    if (!isVerified || !verifiedAt) return false;

    const currentTime = Date.now();
    const isExpired = currentTime - verifiedAt > 5 * 60 * 1000;

    if (isExpired) {
      set({ isVerified: false, verifiedAt: null });
      return false;
    }

    return true;
  },
}));
