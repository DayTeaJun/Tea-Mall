import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import React from "react";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";

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

async function InquiryLists({ query, page }: { query: string; page: number }) {
  const supabase = await createServerSupabaseClient();

  const LIMIT = 10;

  let inquiryQuery = supabase.from("inquiries").select("*", { count: "exact" });

  if (query) {
    inquiryQuery = inquiryQuery.ilike("title", `%${query}%`);
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

      <table className="w-full text-left border-t border-gray-400">
        <thead>
          <tr className="border-b border-gray-00 text-gray-500 text-sm">
            <th className="py-3 px-2 font-medium w-[10%] text-center">No.</th>
            <th className="py-3 px-2 font-medium w-[50%]">제목</th>
            <th className="py-3 px-2 font-medium w-[20%] text-center">
              작성자
            </th>
            <th className="py-3 px-2 font-medium w-[20%] text-center">
              문의상태
            </th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {inqueries?.length !== 0 &&
            inqueries?.map((inquiry: InquiryType, index: number) => {
              return (
                <tr
                  key={inquiry.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-2 font-semibold text-center">
                    {index + 1}
                  </td>
                  <td className="py-4 px-2 font-semibold">{inquiry.title}</td>

                  <td className="py-4 px-2 text-gray-600 text-center">
                    {inquiry.guest_name}
                  </td>

                  <td className="py-4 px-2 text-gray-600 text-center">
                    {inquiry.status === "ANSWERED" ? (
                      <span className="text-green-600 font-semibold">
                        답변완료
                      </span>
                    ) : (
                      <span className="text-gray-500 font-semibold">
                        답변대기
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

          {emptyRowsCount === 10 ? (
            <tr className="w-full h-[530px]">
              <td colSpan={4} className="text-center text-gray-500 py-4">
                검색 결과가 없습니다.
              </td>
            </tr>
          ) : (
            emptyRowsCount > 0 &&
            Array.from({ length: emptyRowsCount }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-[53px]">
                <td className="py-4 px-2">&nbsp;</td>
                <td className="py-4 px-2">&nbsp;</td>
                <td className="py-4 px-2">&nbsp;</td>
                <td className="py-4 px-2">&nbsp;</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        query={query}
        pageCount={(count || 1) / LIMIT}
      />
    </div>
  );
}

export default InquiryLists;
