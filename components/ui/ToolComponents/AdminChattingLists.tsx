"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, UserIcon } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import AdminChatView from "./AdminChatView"; // 분리한 AdminChatView 불러오기

export interface ChatRoomWithUser {
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
}

export default function AdminChattingLists() {
  const [rooms, setRooms] = useState<ChatRoomWithUser[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoomWithUser | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserSupabaseClient();

  const fetchChatRooms = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select(
          `
          *,
          user:public_profiles!user_id (
            user_name,
            profile_image_url
          )
        `,
        )
        .eq("status", "OPEN")
        .order("last_message_at", { ascending: false });

      if (error) throw error;
      if (data) setRooms(data as unknown as ChatRoomWithUser[]);
    } catch (err) {
      console.error("채팅방 목록 불러오기 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();

    const channel = supabase
      .channel("admin_chat_rooms_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "chat_rooms",
        },
        () => {
          fetchChatRooms();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  if (loading) {
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
        <div className="flex items-center gap-2 p-3 border-b border-gray-200 bg-gray-50 shrink-0">
          <button
            type="button"
            onClick={() => setSelectedRoom(null)}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
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
            <span className="font-bold text-xs text-gray-800">{userName}</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <AdminChatView
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

        return (
          <div
            key={room.id}
            onClick={() => setSelectedRoom(room)}
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
                  <p className="font-bold text-sm text-gray-700 truncate">
                    {userName}
                  </p>
                  <div className="flex gap-0.5 items-center text-xs text-gray-400 shrink-0 ml-2">
                    <span>{formatLastMessageTime(room.last_message_at)}</span>
                    <ChevronRight size={14} />
                  </div>
                </div>

                <p className="text-xs text-gray-400 truncate">
                  {room.last_message || "메시지가 없습니다."}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
