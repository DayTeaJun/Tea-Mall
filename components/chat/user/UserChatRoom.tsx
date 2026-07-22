"use client";

import { SendHorizonal } from "lucide-react";
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
  const [roomStatus, setRoomStatus] = useState<string>("OPEN");
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
          .select("id, status")
          .eq("user_id", user.id)
          .eq("status", "OPEN")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingRoom) {
          setRoomId(existingRoom.id);
          setRoomStatus(existingRoom.status);
        } else {
          const { data: newRoom, error: createError } = await supabase
            .from("chat_rooms")
            .insert({ user_id: user.id, status: "OPEN" })
            .select("id, status")
            .single();

          if (createError) throw createError;
          if (newRoom) {
            setRoomId(newRoom.id);
            setRoomStatus(newRoom.status);
          }
        }
      } catch (err) {
        console.error("채팅방 초기화 에러:", err);
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

    const channel = supabase
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

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !user?.id || !roomId || isSubmitting) return;

    if (roomStatus === "CLOSED") {
      toast.warning("종료된 상담입니다.");
      return;
    }

    const messageContent = inputText.trim();
    setInputText("");
    setIsSubmitting(true);

    try {
      const { error: msgError } = await supabase.from("chat_messages").insert({
        room_id: roomId,
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
        .eq("id", roomId);
    } catch (err) {
      console.error(err);
      toast.error("메시지 전송 실패");
      setInputText(messageContent);
    } finally {
      setIsSubmitting(false);
    }
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

      <form
        onSubmit={handleSendMessage}
        className="w-full flex justify-between items-center p-2 gap-2 border-t border-gray-200 bg-white"
      >
        <input
          type="text"
          maxLength={300}
          value={inputText}
          disabled={roomStatus === "CLOSED"}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            roomStatus === "CLOSED"
              ? "종료된 상담입니다."
              : "메시지를 입력해주세요."
          }
          className="text-xs p-2.5 w-full border border-gray-300 rounded-md focus:outline-none focus:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
        />

        <button
          type="submit"
          disabled={
            !inputText.trim() || isSubmitting || roomStatus === "CLOSED"
          }
          className="bg-gray-700 hover:bg-gray-800 disabled:bg-gray-200 p-2.5 text-white rounded-md transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
}
