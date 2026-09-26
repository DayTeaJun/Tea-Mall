"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import TopBtn from "./TopBtn";
import ChattingBtn from "./ChattingBtn";
import AdminMenuBtn from "./AdminMenuBtn";

function MobileToolFab() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();

  return (
    <div className="2xl:hidden fixed bottom-5 right-5 z-50 flex flex-col items-center gap-3">
      <div
        className={`flex flex-col items-center gap-3 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <TopBtn />
        {user && <ChattingBtn />}
        {user && user.level === 3 && <AdminMenuBtn />}
      </div>

      <button
        onClick={() => setOpen((o) => !o)}
        type="button"
        aria-label="도구 메뉴"
        className="p-2.5 bg-white border border-gray-300 rounded-full text-gray-600 shadow-md hover:bg-gray-50 transition-colors flex items-center justify-center"
      >
        <Plus
          size={24}
          className={`transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        />
      </button>
    </div>
  );
}

export default MobileToolFab;
