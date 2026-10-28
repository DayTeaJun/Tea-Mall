import { create } from "zustand";

interface InquiryState {
  pendingPasswords: Record<number, string>;
  setPendingPassword: (id: number, password: string) => void;
  consumePendingPassword: (id: number) => string | undefined;
}

export const useInquiryStore = create<InquiryState>((set, get) => ({
  pendingPasswords: {},
  setPendingPassword: (id, password) =>
    set((state) => ({
      pendingPasswords: { ...state.pendingPasswords, [id]: password },
    })),
  consumePendingPassword: (id) => {
    const password = get().pendingPasswords[id];
    if (password !== undefined) {
      set((state) => {
        const rest = { ...state.pendingPasswords };
        delete rest[id];
        return { pendingPasswords: rest };
      });
    }
    return password;
  },
}));
