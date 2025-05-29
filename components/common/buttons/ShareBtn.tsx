"use client";

import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ShareButton() {
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: shareUrl,
        });
      } catch (err) {
        console.log("공유 취소됨 또는 실패:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("링크가 클립보드에 복사되었습니다.");
      } catch (err) {
        console.error("클립보드 복사 실패:", err);
        toast.error("공유할 수 없습니다.");
      }
    }
  };

  return (
    <button
      className=" hover:text-gray-900 hover:bg-gray-100 m-1 p-1 rounded-full shrink-0 transition-all duration-200"
      onClick={handleShare}
      title="공유하기"
    >
      <Share2 className="cursor-pointer text-gray-600" />
    </button>
  );
}
