"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import ChattingBtn from "./ChattingBtn";

function ChatWidget() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="hidden sm:block fixed bottom-5 right-5 z-50">
      <ChattingBtn />
    </div>
  );
}

export default ChatWidget;
