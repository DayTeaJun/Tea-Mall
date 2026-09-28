"use client";

import { useEffect, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useAuthStore } from "@/lib/store/useAuthStore";

const supabase = createBrowserSupabaseClient();

// ChattingBtn(데스크탑 ChatWidget), MobileBottomTabBar(모바일 탭)가
// 공통으로 쓰는 "안 읽은 채팅 개수 실시간 구독 + 채팅창 열 때 읽음 처리"
// 로직. 원래 ChattingBtn 안에 있던 걸 그대로 뽑아냄 - 동작 변화 없음.
export function useChatUnread() {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuthStore();

  const isChattingRef = useRef(false);

  const fetchUnreadCount = async (userId: string) => {
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

  // 채팅창을 열 때(true로 바뀔 때) 호출 - 관리자가 아니면 읽음 처리
  const markOpen = async (isOpen: boolean) => {
    isChattingRef.current = isOpen;
    if (!isOpen || !user?.id) return;
    if (user.level === 3) return; // 관리자일 경우 읽음 처리하지 않음

    setUnreadCount(0);
    const { error } = await supabase.rpc("mark_messages_as_read", {
      target_user_id: user.id,
    });
    if (error) {
      console.error("❌ DB 읽음 처리 실패:", error);
    }
  };

  return { unreadCount, markOpen };
}
