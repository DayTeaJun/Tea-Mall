"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";

type Props = {
  productId: string;
};

export default function BookmarkBtn({ productId }: Props) {
  const { user } = useAuthStore();

  const handleBookmark = () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
  };

  return (
    <button
      title="즐겨찾기"
      onClick={handleBookmark}
      className={` hover:text-gray-900 hover:bg-gray-100 m-1 p-1 rounded-full shrink-0 transition-all duration-200 `}
    >
      <Heart className="cursor-pointer text-gray-600" />
    </button>
  );
}
