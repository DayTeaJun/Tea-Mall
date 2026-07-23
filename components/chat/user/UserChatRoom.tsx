"use client";

import { SendHorizonal, PlusCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";

interface Message {
  id: number;
  room_id: number;
  sender_id: string;
  content: string;
  created_at: string;
  is_admin?: boolean;
}

export default function UserChatRoom() {
  const { user } = useAuthStore();
  const [roomId, setRoomId] = useState<number | null>(null);
  const [isClosed, setIsClosed] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isInitializingRef = useRef<boolean>(false);

  const supabase = createBrowserSupabaseClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!user || !user.id || isInitializingRef.current) return;

    const initializeRoom = async () => {
      isInitializingRef.current = true;

      try {
        const { data: existingRoom, error: fetchError } = await supabase
          .from("chat_rooms")
          .select("id")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingRoom) {
          setRoomId(existingRoom.id);
        }
      } catch (err) {
        console.error("채팅방 조회 에러:", err);
      } finally {
        isInitializingRef.current = false;
      }
    };

    initializeRoom();
  }, [user?.id]);

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    const msgChannel = supabase
      .channel(`chat_messages_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    const roomChannel = supabase
      .channel(`chat_room_delete_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "chat_rooms",
          filter: `id=eq.${roomId}`,
        },
        () => {
          setIsClosed(true);
          toast.info("상담이 종료되었습니다.");
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(msgChannel);
      supabase.removeChannel(roomChannel);
    };
  }, [roomId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !user?.id || isSubmitting) return;

    if (isClosed) {
      toast.warning("종료된 상담입니다.");
      return;
    }

    const messageContent = inputText.trim();
    setInputText("");
    setIsSubmitting(true);

    try {
      let activeRoomId = roomId;

      if (!activeRoomId) {
        const { data: newRoom, error: createError } = await supabase
          .from("chat_rooms")
          .insert({ user_id: user.id, status: "OPEN" })
          .select("id")
          .single();

        if (createError) throw createError;

        activeRoomId = newRoom.id;
        setRoomId(activeRoomId);
      }

      const { error: msgError } = await supabase.from("chat_messages").insert({
        room_id: activeRoomId,
        sender_id: user.id,
        is_admin: false,
        content: messageContent,
      });

      if (msgError) throw msgError;

      await supabase
        .from("chat_rooms")
        .update({
          last_message: messageContent,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", activeRoomId);
    } catch (err) {
      console.error("메시지 전송 에러:", err);
      toast.error("메시지 전송 실패");
      setInputText(messageContent);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartNewChat = () => {
    setRoomId(null);
    setMessages([]);
    setIsClosed(false);
    toast.info("메시지를 입력하면 새로운 상담이 시작됩니다.");
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {roomId === null && (
          <div className="flex items-center justify-center my-2">
            <span className="px-3 text-xs font-medium text-gray-400 shrink-0">
              새로운 상담을 시작하려면 메시지를 입력해주세요.
            </span>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMyMsg = msg.sender_id === user?.id;
          const showDateHeader =
            index === 0 ||
            formatDate(messages[index - 1].created_at) !==
              formatDate(msg.created_at);

          return (
            <React.Fragment key={msg.id}>
              {showDateHeader && (
                <div className="flex items-center my-2">
                  <div className="flex-1 border-t border-gray-200" />
                  <span className="px-3 text-xs font-medium text-gray-400 shrink-0">
                    {formatDate(msg.created_at)}
                  </span>
                  <div className="flex-1 border-t border-gray-200" />
                </div>
              )}

              {isMyMsg ? (
                <div className="ml-auto flex items-end gap-1.5 max-w-[80%]">
                  <p className="text-[10px] text-gray-400 shrink-0">
                    {formatTime(msg.created_at)}
                  </p>
                  <div className="bg-blue-500 text-white p-2.5 rounded-xl rounded-br-none text-xs leading-relaxed break-all">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="mr-auto flex items-end gap-1.5 max-w-[80%]">
                  <div className="bg-gray-100 text-gray-800 p-2.5 rounded-xl rounded-bl-none text-xs leading-relaxed break-all">
                    {msg.content}
                  </div>
                  <p className="text-[10px] text-gray-400 shrink-0">
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              )}
            </React.Fragment>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {isClosed ? (
        <div className="w-full flex flex-col items-center justify-center p-4 gap-2 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 font-medium">
            상담이 종료되었습니다.
          </p>
          <button
            type="button"
            onClick={handleStartNewChat}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <PlusCircle size={14} />
            <span>새 상담 시작하기</span>
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSendMessage}
          className="w-full flex justify-between items-center p-2 gap-2 border-t border-gray-200 bg-white"
        >
          <input
            type="text"
            maxLength={300}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="메시지를 입력해주세요."
            className="text-xs p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-gray-400"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-200 p-2.5 text-white rounded-md transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <SendHorizonal size={18} />
          </button>
        </form>
      )}
    </div>
  );
}
