"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { PenSquare } from "lucide-react";

function Createbtn() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/inquiry/create")}
      className="w-full sm:w-auto bg-[#111111] text-white rounded-full sm:rounded-sm px-5 py-2.5 sm:py-2 text-sm font-medium hover:bg-[#222222] transition-colors shrink-0 h-[42px] sm:h-[38px] shadow-lg sm:shadow-sm text-center flex items-center justify-center gap-1.5"
    >
      <PenSquare size={16} />
      <span>문의하기</span>
    </button>
  );
}

export default Createbtn;
