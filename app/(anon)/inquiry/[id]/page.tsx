import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { notFound } from "next/navigation";
import React from "react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
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

  const inquiryTypeLabel =
    INQUIRY_TYPE_MAP[inquiry.inquiry_type] || inquiry.inquiry_type;

  const maskName = (name: string | null) => {
    if (!name) return "";
    const trimmed = name.trim();
    if (trimmed.length <= 1) return trimmed;
    if (trimmed.length === 2) return trimmed[0] + "*";
    return `${trimmed[0]}${"*".repeat(trimmed.length - 2)}${trimmed[trimmed.length - 1]}`;
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-4">
        <div className="flex items-center gap-3">
          <span className="bg-gray-900 text-white px-2 py-1 rounded-sm text-xs font-medium">
            {inquiryTypeLabel}
          </span>
          <h1 className="text-xl font-bold text-gray-900">{inquiry.title}</h1>
        </div>
        <div className="text-sm text-gray-500 space-x-2">
          <span>{maskName(inquiry.guest_name)}</span>
          <span>|</span>
          <span>
            {inquiry.created_at
              ? new Date(inquiry.created_at).toLocaleDateString()
              : ""}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm p-6 min-h-[200px] whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
        {inquiry.content}
      </div>

      {inquiry.status === "ANSWERED" && inquiry.answer_content && (
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-sm p-6">
          <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-4">
            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
              관리자 답변
            </h3>
            <span className="text-xs text-gray-400">
              {inquiry.answered_at
                ? new Date(inquiry.answered_at).toLocaleDateString()
                : ""}
            </span>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {inquiry.answer_content}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-end gap-2 border-t border-gray-100 pt-4">
        <Link
          href="/inquiry"
          className="border border-gray-200 text-gray-700 px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-colors"
        >
          목록으로
        </Link>
      </div>
    </main>
  );
}

export default InquiryDetailPage;
