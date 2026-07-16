"use client";

import { useAuthStore } from "@/lib/store/useAuthStore";
import { ChevronRight, UserIcon, X } from "lucide-react";
import React from "react";

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

      <div className="flex-1 overflow-y-auto p-3">
        {isAdmin ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100">
              <div className="w-full flex items-center gap-2">
                <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-100">
                  {!user.profile_image_url ? (
                    // <Image
                    //   fill
                    //   src={user.profile_image_url}
                    //   alt={user.user_name || "Profile"}
                    //   className="object-cover"
                    // />
                    <></>
                  ) : (
                    <div className="w-full h-full p-1 flex items-center justify-center text-gray-300">
                      <UserIcon size={48} />
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-2">
                  <div className="w-full flex justify-between items-center">
                    <p className="font-bold text-sm text-gray-700">
                      Gildong Hong
                    </p>
                    <div className="flex gap-1 items-center text-xs text-gray-400">
                      <span>17:31</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                  <p className="text-12 text-gray-400">상담 내역입니다.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-sm text-gray-400">
            상담 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default Chatting;
