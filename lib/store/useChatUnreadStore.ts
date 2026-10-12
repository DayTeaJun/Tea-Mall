import { create } from "zustand";

interface ChatUnreadState {
  unreadCount: number;
  setUnreadCount: (count: number) => void;
}

export const useChatUnreadStore = create<ChatUnreadState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
