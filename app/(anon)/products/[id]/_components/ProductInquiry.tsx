import React from "react";

function ProductInquiry() {
  return (
    <div
      className="min-h-20 border-b scroll-mt-[146px] flex flex-col gap-2"
      id="product-qa-section"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-[20px] font-semibold my-4">상품 문의</h2>
      </div>
      <div className="p-4">
        <p>
          구매한 상품의 취소/반품은 마이쿠팡 구매내역에서 신청 가능합니다.
          상품문의 및 후기게시판을 통해 취소나 환불, 반품 등은 처리되지
          않습니다. 가격, 판매자, 교환/환불 및 배송 등 해당 상품 자체와 관련
          없는 문의는 고객센터 내 1:1 문의하기를 이용해주세요. "해당 상품
          자체"와 관계없는 글, 양도, 광고성, 욕설, 비방, 도배 등의 글은 예고
          없이 이동, 노출제한, 삭제 등의 조치가 취해질 수 있습니다. 공개
          게시판이므로 전화번호, 메일 주소 등 고객님의 소중한 개인정보는 절대
          남기지 말아주세요.
        </p>
      </div>
    </div>
  );
}

export default ProductInquiry;
