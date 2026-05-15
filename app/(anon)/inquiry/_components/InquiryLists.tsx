import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import React from "react";

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

async function InquiryLists() {
  const supabase = await createServerSupabaseClient();

  const { data: inqueries } = await supabase.from("inquiries").select("*");

  console.log(inqueries);

  return (
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-gray-00 text-gray-500 text-sm">
          <th className="py-3 px-2 font-medium w-[10%]">No.</th>
          <th className="py-3 px-2 font-medium w-[50%]">제목</th>
          <th className="py-3 px-2 font-medium w-[20%]">작성자</th>
          <th className="py-3 px-2 font-medium w-[20%]">문의상태</th>
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
                <td className="py-4 px-2 font-semibold">{index + 1}</td>
                <td className="py-4 px-2 font-semibold">{inquiry.title}</td>

                <td className="py-4 px-2 font-mono text-gray-600">
                  {inquiry.guest_name}
                </td>

                <td className="py-4 px-2 font-mono text-gray-600">
                  {inquiry.status}
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default InquiryLists;
