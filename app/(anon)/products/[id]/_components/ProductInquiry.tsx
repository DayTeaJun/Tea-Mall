import { MailQuestion } from "lucide-react";
import React from "react";
import InquiryBtn from "./InquiryBtn";

function ProductInquiry({ productId }: { productId: string }) {
  return (
    <div
      className="min-h-20 border-b scroll-mt-[146px]"
      id="product-qa-section"
    >
      <div className="flex flex-col gap-6 border border-gray-200 p-4 sm:p-5 mb-6 text-[13px] sm:text-sm text-gray-600 leading-relaxed">
        <div className="flex justify-between items-center -mb-2">
          <h2 className="text-[20px] font-semibold">상품 문의</h2>

          <InquiryBtn productId={productId} />
        </div>

        <ul className="space-y-1.5 list-none pl-0">
          <li>
            <span className="font-medium text-gray-800">·</span> 구매한 상품의{" "}
            <span className="font-semibold">취소/반품/환불</span> 은 마이쿠팡
            구매내역에서 신청해 주세요. (본 게시판에서는 처리 불가)
          </li>
          <li>
            <span className="font-medium text-gray-800">·</span> 가격, 판매자,
            배송 등 상품 자체와 관련 없는 문의는 고객센터{" "}
            <span className="font-semibold">문의하기</span> 를 이용해 주세요.
          </li>
          <li>
            <span className="font-medium text-gray-800">·</span> 상품과 관계없는
            글, 양도, 광고, 욕설, 비방성 글은 예고 없이{" "}
            <span className="font-semibold">노출 제한 및 삭제</span> 조치될 수
            있습니다.
          </li>
          <li>
            <span className="font-medium text-gray-800">·</span> 공개
            게시판이므로 전화번호, 이메일 등{" "}
            <span className="font-semibold">
              개인정보는 절대 남기지 마세요.
            </span>
          </li>
        </ul>

        <ul className="space-y-4">
          <li className="py-10 flex flex-col items-center gap-2 text-gray-500 text-[18px] border-dashed border-2">
            <MailQuestion size={40} />
            아직 작성된 상품문의가 없습니다.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProductInquiry;
