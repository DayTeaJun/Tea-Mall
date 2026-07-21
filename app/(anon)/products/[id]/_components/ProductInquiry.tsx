import { CornerDownRight, MailQuestion } from "lucide-react";
import React from "react";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import ProductInquiryAnswer from "./ProductInquiryAnswer";
import InquiryDelBtn from "./InquiryDelBtn";
import InquiryPostBtn from "./InquiryPostBtn";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};

async function ProductInquiry({ productId }: { productId: string }) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id || null;

  const { data: rawInquiries } = await supabase
    .from("product_inquiry")
    .select(
      `
      id,
      user_id,
      user_name,
      created_at,
      content,
      answer_content,
      answered_at,
      admin_id
    `,
    )
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  const inquiries = rawInquiries
    ? [...rawInquiries].sort((a, b) => {
        if (a.user_id === userId && b.user_id !== userId) return -1;
        if (a.user_id !== userId && b.user_id === userId) return 1;
        return 0;
      })
    : [];

  const myInquiry = inquiries?.find((inquiry) => inquiry.user_id === userId);
  const hasInquiry = !!myInquiry;

  return (
    <div
      className="min-h-20 border-b scroll-mt-[146px] w-full"
      id="product-qa-section"
    >
      <div className="flex flex-col gap-5 border border-gray-200 p-4 sm:p-5 mb-6 text-[12px] sm:text-sm text-gray-600 leading-relaxed">
        <div className="flex justify-between items-center -mb-1">
          <h2 className="text-[18px] sm:text-[20px] font-semibold text-gray-800">
            상품 문의
          </h2>
          {!hasInquiry && <InquiryPostBtn productId={productId} />}
        </div>

        <ul className="space-y-1.5 list-none pl-0 border-b border-gray-100 pb-4 text-gray-500 text-[12px] sm:text-[13px]">
          <li>
            <span className="font-medium text-gray-800">·</span> 구매한 상품의{" "}
            <span className="font-semibold text-gray-700">취소/반품/환불</span>{" "}
            은 마이쿠팡 구매내역에서 신청해 주세요. (본 게시판에서는 처리 불가)
          </li>
          <li>
            <span className="font-medium text-gray-800">·</span> 가격, 판매자,
            배송 등 상품 자체와 관련 없는 문의는 고객센터{" "}
            <span className="font-semibold text-gray-700">문의하기</span> 를
            이용해 주세요.
          </li>
          <li>
            <span className="font-medium text-gray-800">·</span> 상품과 관계없는
            글, 양도, 광고, 욕설, 비방성 글은 예고 없이{" "}
            <span className="font-semibold text-gray-700">
              노출 제한 및 삭제
            </span>{" "}
            조치될 수 있습니다.
          </li>
          <li>
            <span className="font-medium text-gray-800">·</span> 공개
            게시판이므로 전화번호, 이메일 등{" "}
            <span className="font-semibold text-gray-700">
              개인정보는 절대 남기지 마세요.
            </span>
          </li>
        </ul>

        <div className="w-full flex flex-col">
          {inquiries && inquiries.length > 0 ? (
            <ul className="divide-y divide-gray-100/60">
              {inquiries.map((inquiry) => {
                const isMyItem = inquiry.user_id === userId;

                return (
                  <li
                    key={inquiry.id}
                    className={`py-4 sm:py-5 flex flex-col gap-3 transition-colors ${
                      isMyItem
                        ? "bg-gray-50/70 -mx-4 px-4 sm:-mx-5 sm:px-5 my-1 first:mt-0 relative"
                        : ""
                    }`}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1.5 text-[11px] sm:text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded-xs text-[10px] sm:text-[11px] tracking-tight text-white ${
                              isMyItem ? "bg-gray-900" : "bg-gray-500"
                            }`}
                          >
                            {isMyItem ? "내 문의" : "질문"}
                          </span>
                          <span
                            className={`font-medium ${isMyItem ? "text-gray-900 font-semibold" : "text-gray-600"}`}
                          >
                            {inquiry.user_name}
                          </span>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 text-gray-400">
                          <span>{formatDate(inquiry.created_at)}</span>
                          {isMyItem && (
                            <InquiryDelBtn
                              productId={productId}
                              myInquiryId={inquiry.id}
                            />
                          )}
                        </div>
                      </div>

                      <p
                        className={`whitespace-pre-line pl-0.5 text-[13px] sm:text-sm leading-relaxed ${
                          isMyItem
                            ? "text-gray-950 font-medium"
                            : "text-gray-800"
                        }`}
                      >
                        {inquiry.content}
                      </p>
                    </div>

                    {inquiry.answer_content ? (
                      <div className="p-3.5 sm:p-4 rounded-sm border-t flex gap-2 items-start mt-1 bg-gray-50/50 border-gray-100">
                        <CornerDownRight
                          size={14}
                          className="text-gray-400 shrink-0 mt-1 sm:w-4 sm:h-4"
                        />

                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-[11px] sm:text-xs text-gray-400">
                            <div className="flex items-center gap-2">
                              <span className="bg-green-600 text-white font-bold px-1.5 py-0.5 rounded-xs text-[10px] sm:text-[11px]">
                                답변
                              </span>
                              <span className="font-bold text-gray-700">
                                판매자
                              </span>
                            </div>
                            {inquiry.answered_at && (
                              <span>{formatDate(inquiry.answered_at)}</span>
                            )}
                          </div>

                          <p className="text-gray-700 whitespace-pre-line text-[13px] sm:text-sm leading-relaxed pl-0.5">
                            {inquiry.answer_content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <ProductInquiryAnswer
                        inquiry_id={inquiry.id}
                        answer_content={inquiry.answer_content}
                        answered_at={inquiry.answered_at}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className="space-y-4 pl-0">
              <li className="py-10 flex flex-col items-center gap-2 text-gray-500 text-[15px] sm:text-[18px] border-dashed border-2 border-gray-200 rounded-sm">
                <MailQuestion
                  size={36}
                  className="text-gray-400 sm:w-10 sm:h-10"
                />
                아직 작성된 상품문의가 없습니다.
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductInquiry;
