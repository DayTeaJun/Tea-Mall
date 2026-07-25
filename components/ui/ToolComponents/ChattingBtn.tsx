"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import ChattingModal from "../../chat/ChattingModal";
import { useChatStore } from "@/lib/store/useChatStore";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";

const supabase = createBrowserSupabaseClient();

function ChattingBtn() {
  const [isChatting, setIsChatting] = useState(false);
  const { user } = useAuthStore();
  const { unreadCount, incrementUnread, clearUnread } = useChatStore();

  const isChattingRef = useRef(isChatting);

  useEffect(() => {
    isChattingRef.current = isChatting;
  }, [isChatting]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`global_chat_notifications_${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMsg = payload.new;

          if (!isChattingRef.current && newMsg.sender_id !== user.id) {
            incrementUnread();
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime Notification Channel Status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, incrementUnread]);

  const handleToggleChat = () => {
    const nextState = !isChatting;
    setIsChatting(nextState);

    if (nextState) {
      clearUnread();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggleChat}
        type="button"
        className="p-3 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300 transition-colors relative"
      >
        <MessageCircle size={25} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isChatting && <ChattingModal onClose={() => setIsChatting(false)} />}
    </div>
  );
}

export default ChattingBtn;
