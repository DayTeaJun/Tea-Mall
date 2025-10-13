"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  deleteFavorite,
  getFavorite,
  postFavorite,
} from "@/lib/queries/products";

type Props = {
  productId: string;
  initialFavorited: boolean;
};

export default function BookmarkBtn({ productId, initialFavorited }: Props) {
  const { user } = useAuthStore();
  const router = useRouter();

  const [isFavorited, setIsFavorited] = useState<boolean>(initialFavorited);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!user?.id) return;
      const favorite = await getFavorite(user.id, productId);
      setIsFavorited(!!favorite);
    };

    fetchFavoriteStatus();
  }, [user?.id, productId]);

  const handleBookmark = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    if (isFavorited) {
      const removed = await deleteFavorite(user.id, productId);
      if (removed) {
        toast.success("즐겨찾기에서 제거되었습니다.");
        setIsFavorited(false);
      }
    } else {
      const added = await postFavorite(user.id, productId);
      if (added) {
        toast.success("즐겨찾기에 추가되었습니다.");
        setIsFavorited(true);
      }
    }

    router.refresh();
  };

  return (
    <button
      onClick={handleBookmark}
      title="즐겨찾기"
      className="hover:text-gray-900 hover:bg-gray-100 m-1 p-1 rounded-full shrink-0 transition-all duration-200"
    >
      <Heart
        className={`w-6 h-6 cursor-pointer ${
          isFavorited
            ? "text-red-500 fill-red-500" // 내부를 연한 빨강으로 채움
            : "text-gray-600 fill-transparent" // 내부 비움
        } fill-current`}
      />
    </button>
  );
}
