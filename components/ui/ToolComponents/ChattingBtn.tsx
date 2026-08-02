"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
import ChattingModal from "../../chat/ChattingModal";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

const supabase = createBrowserSupabaseClient();

function ChattingBtn() {
  const [isChatting, setIsChatting] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthStore();

  const isChattingRef = useRef(isChatting);

  useEffect(() => {
    isChattingRef.current = isChatting;
  }, [isChatting]);

  const fetchUnreadCount = async (userId: string) => {
    // chat_rooms 테이블과 조인(inner join)하여 status가 'OPEN'(또는 CLOSED가 아닌 것)인 방의 메시지만 카운트
    const { count, error } = await supabase
      .from("chat_messages")
      .select("id, chat_rooms!inner(status)", { count: "exact", head: true })
      .neq("sender_id", userId)
      .eq("is_read", false)
      .neq("chat_rooms.status", "CLOSED");

    if (!error && count !== null) {
      setUnreadCount(count);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    let channel: RealtimeChannel | null = null;
    let isMounted = true;

    const initSubscription = async () => {
      // 초기 안 읽은 개수 가져오기
      await fetchUnreadCount(user.id);

      if (!isMounted) return;

      const channelName = `chat_notif_${user.id}`;

      const existingChannels = supabase.getChannels();
      for (const ch of existingChannels) {
        if (ch.topic === `realtime:${channelName}`) {
          await supabase.removeChannel(ch);
        }
      }

      if (!isMounted) return;

      // 신규 채널 생성 및 구독
      channel = supabase
        .channel(channelName, {
          config: {
            broadcast: { self: false },
          },
        })
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          async (payload) => {
            const newMsg = payload.new;

            if (newMsg && newMsg.sender_id !== user.id) {
              if (user.level === 3) {
                await fetchUnreadCount(user.id);
              } else if (isChattingRef.current) {
                await supabase.rpc("mark_messages_as_read", {
                  target_user_id: user.id,
                });
              } else {
                await fetchUnreadCount(user.id);
              }
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chat_messages",
          },
          async (payload) => {
            // UPDATE가 일어났을 때, 내가 받은 메시지의 is_read가 true로 바뀐 경우라면 즉시 갱신
            const updatedMsg = payload.new;
            if (updatedMsg && updatedMsg.is_read === true) {
              await fetchUnreadCount(user.id);
            }
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chat_rooms",
          },
          async (payload) => {
            const updatedRoom = payload.new;
            // 관리자가 상담 종료(status를 'CLOSED'로 변경)를 누른 경우 즉시 0으로 리셋
            if (updatedRoom && updatedRoom.status === "CLOSED") {
              setUnreadCount(0);
            }
          },
        )
        .subscribe((status, err) => {
          if (err) console.error("❌ Realtime 에러:", err);
        });
    };

    initSubscription();

    return () => {
      isMounted = false;
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [user?.id]);

  // 버튼 클릭 시 (채팅창 토글)
  const handleToggleChat = async () => {
    const nextState = !isChatting;
    setIsChatting(nextState);

    if (nextState && user?.id) {
      if (user.level === 3) return; // 관리자일 경우 읽음 처리하지 않음

      setUnreadCount(0);

      const { error } = await supabase.rpc("mark_messages_as_read", {
        target_user_id: user.id,
      });

      if (error) {
        console.error("❌ DB 읽음 처리 실패:", error);
      }
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
