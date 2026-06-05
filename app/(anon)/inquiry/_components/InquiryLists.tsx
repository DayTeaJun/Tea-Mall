import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import React from "react";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";
import InquiryRow from "./InquiryRow"; // 💡 신규 생성한 행 컴포넌트 로드

interface InquiryType {
  admin_id: string | null;
  answer_content: string | null;
  answered_at: string | null;
  content: string;
  created_at: string | null;
  email: string | null;
  guest_name: string | null;
  id: number;
  inquiry_type: string;
  is_privacy_agreed: boolean | null;
  is_public: boolean | null;
  password: string | null;
  phone_number: string | null;
  status: string | null;
  title: string;
  updated_at: string | null;
  user_id: string | null;
}

const INQUIRY_TYPE_MAP: Record<string, string> = {
  DELIVERY: "배송",
  PRODUCT: "상품",
  CANCEL: "취소/반품",
  ORDER: "주문/결제",
  OTHER: "기타",
  AUTH: "계정",
};

async function InquiryLists({
  query,
  page,
  type,
}: {
  query: string;
  page: number;
  type: string;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userLevel = user?.user_metadata?.level ?? 1;
  const currentUserId = user?.id ?? null;

  const LIMIT = 10;
  let inquiryQuery = supabase.from("inquiries").select("*", { count: "exact" });

  if (query && query.trim() !== "") {
    const searchTarget = `%${query.trim()}%`;

    if (type === "title") {
      inquiryQuery = inquiryQuery.ilike("title", searchTarget);
    } else if (type === "author") {
      inquiryQuery = inquiryQuery.ilike("guest_name", searchTarget);
    } else {
      inquiryQuery = inquiryQuery.or(
        `title.ilike.${searchTarget},guest_name.ilike.${searchTarget}`,
      );
    }
  }

  const from = (page - 1) * LIMIT;
  const to = from + LIMIT - 1;

  const { data: inqueries, count } = await inquiryQuery
    .range(from, to)
    .order("created_at", { ascending: false });

  const currentLength = inqueries?.length || 0;
  const emptyRowsCount = LIMIT - currentLength;

  return (
    <div className="flex flex-col gap-4">
      <SearchInput />

      <table className="w-full text-left border-t border-gray-400 table-fixed">
        <thead>
          <tr className="border-b border-gray-100 text-gray-500 text-sm">
            <th className="py-3 px-2 font-medium w-[8%] text-center">No.</th>
            <th className="py-3 px-2 font-medium w-[15%] text-center">
              문의유형
            </th>
            <th className="py-3 px-2 font-medium w-[47%]">제목</th>
            <th className="py-3 px-2 font-medium w-[15%] text-center">
              작성자
            </th>
            <th className="py-3 px-2 font-medium w-[15%] text-center">
              문의상태
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {inqueries?.length !== 0 &&
            inqueries?.map((inquiry: InquiryType, index: number) => {
              const inquiryTypeLabel =
                INQUIRY_TYPE_MAP[inquiry.inquiry_type] || inquiry.inquiry_type;
              const displayIndex = (count || 0) - (page - 1) * LIMIT - index;

              return (
                <InquiryRow
                  key={inquiry.id}
                  inquiry={inquiry}
                  displayIndex={displayIndex}
                  inquiryTypeLabel={inquiryTypeLabel}
                  userLevel={userLevel}
                  currentUserId={currentUserId}
                />
              );
            })}

          {emptyRowsCount === 10 ? (
            <tr className="w-full h-[530px]">
              <td colSpan={5} className="text-center text-gray-500 py-4">
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            emptyRowsCount > 0 &&
            Array.from({ length: emptyRowsCount }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-[53px]">
                <td colSpan={5} className="py-4 px-2">
                  &nbsp;
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        query={query}
        pageCount={Math.ceil((count || 1) / LIMIT)}
      />
    </div>
  );
}

export default InquiryLists;
