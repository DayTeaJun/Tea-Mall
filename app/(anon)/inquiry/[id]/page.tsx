import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import CommentSection from "./_components/CommentSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

const INQUIRY_TYPE_MAP: Record<string, string> = {
  DELIVERY: "배송",
  PRODUCT: "상품",
  CANCEL: "취소/반품",
  ORDER: "주문/결제",
  OTHER: "기타",
  AUTH: "계정",
};

async function InquiryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: inquiry } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (!inquiry) {
    notFound();
  }

  const maskName = (name: string | null) => {
    if (!name) return "";
    const trimmed = name.trim();
    if (trimmed.length <= 1) return trimmed;
    if (trimmed.length === 2) return trimmed[0] + "*";
    return `${trimmed[0]}${"*".repeat(trimmed.length - 2)}${trimmed[trimmed.length - 1]}`;
  };

  const inquiryTypeLabel =
    INQUIRY_TYPE_MAP[inquiry.inquiry_type] || inquiry.inquiry_type;

  return (
    <div className="w-full text-black">
      <div className="flex flex-col gap-3 h-full">
        <div className="w-full flex flex-col border-b-2 border-solid border-gray-200 py-2 gap-3">
          <h2 className="flex gap-2 text-2xl font-bold items-center">
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-sm font-medium">
              {inquiryTypeLabel}
            </span>
            {inquiry.title}
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 sm:items-center sm:gap-5 sm:flex-row">
              <p className="text-sm text-gray-400">
                {maskName(inquiry.guest_name)}
              </p>
              <p className="text-sm text-gray-400">
                {inquiry.created_at
                  ? new Date(inquiry.created_at).toLocaleDateString()
                  : ""}
              </p>
            </div>

            <Link
              href="/inquiry"
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 transition-colors font-medium rounded-sm"
            >
              목록보기
            </Link>
          </div>
        </div>

        <div className="border-solid border-gray-100 min-h-[150px] py-4">
          <p className="text-lg whitespace-pre-wrap leading-8 text-gray-800">
            {inquiry.content}
          </p>
        </div>

        <CommentSection inquiry={inquiry} />
      </div>
    </div>
  );
}

export default InquiryDetailPage;
