"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Trash2, UserIcon } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import AdminChatRoom from "./AdminChatRoom";
import { useGetAdminChatList } from "@/lib/queries/auth";
import { queryClient } from "@/components/providers/ReactQueryProvider";

export interface AdminChatListProps {
  id: number;
  user_id: string;
  admin_id: string | null;
  status: "OPEN" | "CLOSED";
  last_message: string | null;
  last_message_at: string;
  created_at: string;
  user?: {
    user_name: string | null;
    profile_image_url: string | null;
  };
  unread_count?: number;
}

export default function AdminChatList() {
  const { user } = useAuthStore();

  const [selectedRoom, setSelectedRoom] = useState<AdminChatListProps | null>(
    null,
  );
  const [isClosing, setIsClosing] = useState(false);

  const supabase = createBrowserSupabaseClient();
  const isAdmin = user?.level === 3;

  const { data: rooms = [], isLoading } = useGetAdminChatList(user?.id || "");

  useEffect(() => {
    if (!user?.id && !isAdmin) return;

    const roomChannel = supabase
      .channel("admin_chat_rooms_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "chat_rooms" },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["adminChatList", user?.id],
          }),
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["adminChatList", user?.id],
          }),
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_messages" },
        () =>
          queryClient.invalidateQueries({
            queryKey: ["adminChatList", user?.id],
          }),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
    };
  }, [user?.id]);

  const handleSelectRoom = async (room: AdminChatListProps) => {
    setSelectedRoom(room);

    // 낙관적 업데이트
    // setRooms((prevRooms) =>
    //   prevRooms.map((r) => (r.id === room.id ? { ...r, unread_count: 0 } : r)),
    // );

    const { error } = await supabase.rpc("mark_room_messages_as_read", {
      target_room_id: room.id,
    });

    if (error) {
      console.error("메시지 읽음 처리 오류:", error);
      queryClient.invalidateQueries({ queryKey: ["adminChatList", user?.id] });
    }
  };

  const handleCloseAndDeleteRoom = async (roomId: number) => {
    if (!isAdmin) {
      toast.error("관리자 권한(Level 3)이 필요합니다.");
      return;
    }

    if (
      !confirm(
        "상담을 종료하고 이 채팅방과 모든 대화 내역을 완전히 삭제하시겠습니까?",
      )
    ) {
      return;
    }

    setIsClosing(true);

    try {
      await supabase.from("chat_messages").delete().eq("room_id", roomId);

      const { error: deleteRoomError } = await supabase
        .from("chat_rooms")
        .delete()
        .eq("id", roomId);

      if (deleteRoomError) throw deleteRoomError;

      toast.success("상담방과 대화 내역이 완전히 삭제되었습니다.");
      setSelectedRoom(null);
      queryClient.invalidateQueries({ queryKey: ["adminChatList", user?.id] });
    } catch (err) {
      console.error("채팅방 삭제 에러:", err);
      toast.error("상담 종료 및 삭제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsClosing(false);
    }
  };

  const formatLastMessageTime = (isoString: string) => {
    if (!isoString) return "";
    const messageDate = new Date(isoString);
    const today = new Date();

    const isToday =
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear();

    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    }

    return `${messageDate.getMonth() + 1}월 ${messageDate.getDate()}일`;
  };

  if (isLoading) {
    return (
      <div className="p-4 text-xs text-gray-400">
        채팅방 목록을 불러오는 중...
      </div>
    );
  }

  if (selectedRoom) {
    const userName = selectedRoom.user?.user_name || "익명 사용자";

    return (
      <div className="flex flex-col h-full bg-white">
        <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
              className="p-1 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-200 border border-gray-300 shrink-0">
                {selectedRoom.user?.profile_image_url ? (
                  <Image
                    fill
                    src={selectedRoom.user.profile_image_url}
                    alt={userName}
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon size={18} />
                  </div>
                )}
              </div>
              <span className="font-bold text-xs text-gray-800">
                {userName}
              </span>
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              onClick={() => handleCloseAndDeleteRoom(selectedRoom.id)}
              disabled={isClosing}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1.5 rounded transition-colors disabled:opacity-50 cursor-pointer font-medium border border-red-200"
            >
              <Trash2 size={14} />
              <span>상담 종료</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <AdminChatRoom
            roomId={selectedRoom.id}
            roomStatus={selectedRoom.status}
          />
        </div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="p-4 text-xs text-gray-400 text-center">
        진행 중인 문의가 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto h-full bg-white">
      {rooms.map((room) => {
        const userName = room.user?.user_name || "익명 사용자";
        const profileImage = room.user?.profile_image_url;
        const unreadCount = room.unread_count || 0;

        return (
          <div
            key={room.id}
            onClick={() => handleSelectRoom(room)}
            className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100"
          >
            <div className="w-full flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                {profileImage ? (
                  <Image
                    fill
                    src={profileImage}
                    alt={userName}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full p-1 flex items-center justify-center text-gray-300">
                    <UserIcon size={32} />
                  </div>
                )}
              </div>

              <div className="w-full flex flex-col gap-1 overflow-hidden">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <p className="font-bold text-sm text-gray-700 truncate">
                      {userName}
                    </p>
                  </div>
                  <div className="flex gap-0.5 items-center text-xs text-gray-400 shrink-0 ml-2">
                    <span>{formatLastMessageTime(room.last_message_at)}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400 truncate">
                    {room.last_message || "메시지가 없습니다."}
                  </p>
                  {unreadCount > 0 && (
                    <span className="flex items-center justify-center text-10 bg-red-500 text-white font-bold w-4 h-4 rounded-full shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
