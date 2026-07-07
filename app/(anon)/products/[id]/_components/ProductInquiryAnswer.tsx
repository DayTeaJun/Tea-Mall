"use client";

import { CornerDownRight } from "lucide-react";
import React, { useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";

interface Props {
  inquiry_id: number;
  answer_content: string | null;
  answered_at: string | null;
}

function ProductInquiryAnswer(inquiry: Props) {
  const { user } = useAuthStore();
  const isAdmin = user?.level === 3;

  const [content, setContent] = useState("");

  const handleSendcontent = async () => {
    if (!content.trim()) {
      toast.warning("답변 내용을 입력해주세요.");
      return;
    }
    if (!user?.id) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    if (!isAdmin) {
      toast.error("관리자만 답변을 작성할 수 있습니다.");
      return;
    }

    const supabase = createBrowserSupabaseClient();

    try {
      const { data, error } = await supabase
        .from("product_inquiry")
        .update({
          admin_id: user.id,
          answer_content: content,
          answered_at: new Date().toISOString(),
        })
        .eq("id", inquiry.inquiry_id);

      console.log("업데이트 결과 데이터:", data);

      if (error) throw error;

      toast.success("답변이 정상적으로 등록되었습니다.");
      setContent("");
    } catch (err) {
      console.error(err);
      toast.error("답변 등록에 실패했습니다.");
    }
  };

  if (!inquiry.answer_content && !inquiry.answered_at && !isAdmin) {
    return null;
  }

  return (
    <div className="bg-gray-50/50 p-4 rounded-sm border-t border-gray-100 flex gap-2 items-start mt-1">
      <CornerDownRight size={16} className="text-gray-400 shrink-0 mt-1" />

      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="bg-gray-600 text-white font-bold px-1.5 py-0.5 rounded-xs text-[11px]">
            답변
          </span>
          <span className="font-bold text-gray-700">[판매자 답변 작성]</span>
        </div>

        <div className="w-full flex border border-gray-200 overflow-hidden bg-white">
          <textarea
            spellCheck={false}
            value={content}
            placeholder="답변을 작성해주세요."
            onChange={(e) => setContent(e.target.value)}
            className="p-2 text-sm w-full h-[100px] outline-none resize-none leading-6 text-gray-800 disabled:bg-gray-50"
          />
          <button
            type="button"
            onClick={handleSendcontent}
            className="w-[90px] h-[100px] font-bold text-white text-sm bg-gray-600 hover:bg-gray-700 duration-200 transition-all flex justify-center items-center shrink-0 disabled:bg-gray-400"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductInquiryAnswer;
