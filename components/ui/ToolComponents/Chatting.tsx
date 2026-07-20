"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { X } from "lucide-react";
import React from "react";
import AdminChattingLists from "./AdminChattingLists";
import UserChatting from "./UserChatting";

interface Props {
  onClose: () => void;
}

function Chatting({ onClose }: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.level === 3;

  return (
    <div className="absolute right-14 bottom-0 w-[360px] h-[500px] bg-white shadow-xl rounded border border-gray-200 flex flex-col py-3 z-50">
      <div className="flex justify-between items-center pb-3 border-b border-gray-100 px-4">
        <h2 className="font-bold text-18 text-gray-800">채팅 상담</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isAdmin ? <AdminChattingLists /> : <UserChatting />}
      </div>
    </div>
  );
}

export default Chatting;
