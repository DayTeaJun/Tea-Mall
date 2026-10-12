"use client";

import { useEffect } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatUnreadStore } from "@/lib/store/useChatUnreadStore";

const supabase = createBrowserSupabaseClient();

// realtime 구독은 모듈 전역에서 단 하나만 만들고, unreadCount는
// useChatUnreadStore(zustand)로 공유해서 ChattingBtn/MobileBottomTabBar
// 두 컴포넌트가 항상 같은 값을 보게 함.
let activeChannel: RealtimeChannel | null = null;
let activeUserId: string | null = null;
let subscriberCount = 0;
const isChattingRef = { current: false };

const fetchUnreadCount = async (userId: string) => {
  const { count, error } = await supabase
    .from("chat_messages")
    .select("id, chat_rooms!inner(status)", { count: "exact", head: true })
    .neq("sender_id", userId)
    .eq("is_read", false)
    .neq("chat_rooms.status", "CLOSED");

  if (!error && count !== null) {
    useChatUnreadStore.getState().setUnreadCount(count);
  }
};

const ensureSubscription = async (
  userId: string,
  level: number | null | undefined,
) => {
  // 동기적으로 먼저 점유 표시 - 두 컴포넌트의 useEffect가 거의 동시에
  // 호출해도 이 줄은 await 전이라 순서대로 실행되므로, 뒤에 들어온 쪽은
  // 바로 여기서 걸러짐 (중복 채널 생성 방지)
  if (activeUserId === userId) return;
  activeUserId = userId;

  if (activeChannel) {
    await supabase.removeChannel(activeChannel);
    activeChannel = null;
  }

  await fetchUnreadCount(userId);

  const channelName = `chat_notif_${userId}`;

  const existingChannels = supabase.getChannels();
  for (const ch of existingChannels) {
    if (ch.topic === `realtime:${channelName}`) {
      await supabase.removeChannel(ch);
    }
  }

  activeChannel = supabase
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

        if (newMsg && newMsg.sender_id !== userId) {
          if (level === 3) {
            await fetchUnreadCount(userId);
          } else if (isChattingRef.current) {
            await supabase.rpc("mark_messages_as_read", {
              target_user_id: userId,
            });
          } else {
            await fetchUnreadCount(userId);
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
          await fetchUnreadCount(userId);
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
          useChatUnreadStore.getState().setUnreadCount(0);
        }
      },
    )
    .subscribe((status, err) => {
      if (err) console.error("❌ Realtime 에러:", err);
    });
};

const teardownSubscription = async () => {
  if (activeChannel) {
    await supabase.removeChannel(activeChannel);
    activeChannel = null;
  }
  activeUserId = null;
};

export function useChatUnread() {
  const { user } = useAuthStore();
  const unreadCount = useChatUnreadStore((state) => state.unreadCount);

  useEffect(() => {
    if (!user?.id) return;

    subscriberCount += 1;
    ensureSubscription(user.id, user.level);

    return () => {
      subscriberCount -= 1;
      if (subscriberCount <= 0) {
        teardownSubscription();
      }
    };
  }, [user?.id, user?.level]);

  // 채팅창을 열 때(true로 바뀔 때) 호출 - 관리자가 아니면 읽음 처리
  const markOpen = async (isOpen: boolean) => {
    isChattingRef.current = isOpen;
    if (!isOpen || !user?.id) return;
    if (user.level === 3) return; // 관리자일 경우 읽음 처리하지 않음

    useChatUnreadStore.getState().setUnreadCount(0);
    const { error } = await supabase.rpc("mark_messages_as_read", {
      target_user_id: user.id,
    });
    if (error) {
      console.error("❌ DB 읽음 처리 실패:", error);
    }
  };

  return { unreadCount, markOpen };
}
