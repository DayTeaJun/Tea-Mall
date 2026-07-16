"use client";

import React from "react";
import { ChevronRight, UserIcon } from "lucide-react";

function AdminChattingRoom() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100">
        <div className="w-full flex items-center gap-2">
          <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden bg-gray-100">
            {/* {!user.profile_image_url ? (
                    // <Image
                    //   fill
                    //   src={user.profile_image_url}
                    //   alt={user.user_name || "Profile"}
                    //   className="object-cover"
                    // />
                    <></>
                  ) : ( */}
            <div className="w-full h-full p-1 flex items-center justify-center text-gray-300">
              <UserIcon size={48} />
            </div>
            {/* )} */}
          </div>

          <div className="w-full flex flex-col gap-2">
            <div className="w-full flex justify-between items-center">
              <p className="font-bold text-sm text-gray-700">Gildong Hong</p>
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
  );
}

export default AdminChattingRoom;
