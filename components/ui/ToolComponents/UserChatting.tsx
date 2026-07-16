import { SendHorizonal } from "lucide-react";
import React from "react";

function UserChatting() {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="h-full flex flex-col gap-2 p-3">
        <button
          type="button"
          className="text-14 p-1 px-4 bg-gray-100 text-gray-500 w-fit rounded-xl mx-auto hover:text-gray-700"
        >
          이전 채팅기록 보기
        </button>

        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-gray-200" />
          <span className="px-3 text-xs font-medium text-gray-400 shrink-0">
            2026-07-16
          </span>
          <div className="flex-1 border-t border-gray-200" />
        </div>

        {/* 사용자 채팅 */}
        <div className="ml-auto flex items-end gap-2">
          <p className="text-10 text-gray-400">18:23</p>
          <div className="flex gap-2 bg-gray-100 p-2 rounded-xl rounded-br-none">
            <p className="max-w-60 text-14 tracking-wider">
              채팅함채팅함채팅함채팅함채팅함채팅함채팅함채팅함채팅함채팅함채팅함채팅함채팅함채팅함채팅함
            </p>
          </div>
        </div>

        {/* 관리자 채팅 */}
        <div className="mr-auto flex items-end gap-2">
          <div className="flex gap-2 bg-gray-100 p-2 rounded-xl rounded-bl-none">
            <p className="max-w-60 text-14">답장입니다.</p>
          </div>
          <p className="text-10 text-gray-400">18:25</p>
        </div>
      </div>

      <div className="w-full flex justify-between items-center pt-3 px-2 gap-2 border-t border-gray-200">
        <input
          type="text"
          maxLength={300}
          placeholder="메시지를 입력해주세요."
          className="text-12 p-2 w-full resize-none border border-gray-300 rounded-md"
        />

        <button type="button" className="bg-gray-200 p-2 text-gray-500">
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
}

export default UserChatting;
