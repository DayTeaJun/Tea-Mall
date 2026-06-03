"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { toast } from "sonner";

interface CommentSectionProps {
  inquiry: {
    id: number;
    status: string | null;
    answer_content: string | null;
    answered_at: string | null;
    admin_id: string | null;
  };
}

export default function CommentSection({ inquiry }: CommentSectionProps) {
  const router = useRouter();
  const { user } = useAuthStore();

  const isAdmin = user?.level === 3;

  const [comment, setComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(inquiry.answer_content || "");

  const handleSendComment = async () => {
    if (!comment.trim()) {
      toast.warning("답변 내용을 입력해주세요.");
      return;
    }

    toast.success("답변이 등록되었습니다.");
    setComment("");
    router.refresh();
  };

  const handleSaveEdit = async () => {
    if (!editContent.trim()) {
      toast.warning("내용을 입력해주세요.");
      return;
    }

    setIsEditing(false);
    toast.success("답변이 수정되었습니다.");
    router.refresh();
  };

  const handleDeleteComment = async () => {
    if (confirm("답변을 삭제하시겠습니까?")) {
      toast.success("답변이 삭제되었습니다.");
      setEditContent("");
      setIsEditing(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-2 mt-5">
      <div className="flex justify-between w-full border-b border-gray-100 pb-2">
        <p className="font-bold w-[80px] text-base border-b-4 border-gray-900 pb-2">
          문의 답변
        </p>
      </div>

      {inquiry.answer_content ? (
        <div className="flex flex-col gap-4 p-2 mt-2">
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <User size={12} className="text-gray-600" />
              <p className="text-sm font-semibold text-gray-700">최고관리자</p>
              <p className="ml-2 text-xs text-gray-400">
                {inquiry.answered_at
                  ? new Date(inquiry.answered_at).toLocaleDateString()
                  : ""}
              </p>
            </div>

            {isAdmin && (
              <div className="flex gap-1 text-xs text-gray-500">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveEdit}
                      className="hover:font-bold hover:text-black"
                      type="button"
                    >
                      저장
                    </button>
                    <p className="text-gray-200">|</p>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditContent(inquiry.answer_content || "");
                      }}
                      className="hover:font-bold hover:text-black"
                      type="button"
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="hover:font-bold hover:text-black"
                      type="button"
                    >
                      수정
                    </button>
                    <p className="text-gray-200">|</p>
                    <button
                      onClick={handleDeleteComment}
                      className="hover:font-bold hover:text-red-600"
                      type="button"
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {isEditing ? (
            <textarea
              spellCheck={false}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="border p-4 border-solid border-gray-200 text-sm w-full h-[180px] outline-none resize-none leading-7 rounded-sm focus:border-black"
            />
          ) : (
            <div className="bg-[#f9f8f9] p-5 rounded-sm border border-gray-50">
              <p className="text-base whitespace-pre-wrap leading-8 text-[#555555] font-medium">
                {inquiry.answer_content}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4 p-2 h-[80px] justify-center items-center">
          <p className="w-full text-gray-400 text-sm text-center">
            아직 작성된 답변이 없습니다.
          </p>
        </div>
      )}

      <div className="mb-6" />

      {isAdmin && !inquiry.answer_content && (
        <div className="mt-4">
          <p className="font-bold w-[70px] text-base border-b-4 border-gray-900 pb-2 mb-4">
            답변 작성
          </p>
          <div className="w-full flex border border-gray-200 rounded-sm overflow-hidden focus-within:border-black transition-all">
            <textarea
              spellCheck={false}
              value={comment}
              placeholder="답변을 작성해주세요."
              onChange={(e) => setComment(e.target.value)}
              className="p-3 text-sm w-full h-[120px] outline-none resize-none leading-6 text-gray-800"
            />
            <button
              type="button"
              onClick={handleSendComment}
              className="w-[100px] h-[120px] font-bold text-white text-sm bg-[#222]/80 hover:bg-[#111] duration-200 transition-all flex justify-center items-center shrink-0"
            >
              등록
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
