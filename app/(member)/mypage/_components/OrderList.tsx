"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function OrderList() {
  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-xl font-bold mb-4">주문목록</h2>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="주문한 상품을 검색할 수 있어요!"
          className="w-full px-4 py-2 border rounded-md text-sm"
        />
        <Button variant="outline">
          <Search size={20} />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="secondary">최근 6개월</Button>
        {["2025", "2024", "2023", "2022", "2021", "2020"].map((year) => (
          <Button key={year} variant="ghost" className="text-gray-600">
            {year}
          </Button>
        ))}
      </div>

      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-sm text-gray-800">
            2025. 6. 19 주문
          </h3>
          <Button variant="link" className="text-sm p-0 h-auto">
            주문 상세보기 &gt;
          </Button>
        </div>

        <div className="bg-gray-50 rounded-md p-4">
          <h4 className="font-semibold text-sm mb-4">배송완료</h4>

          <ul className="space-y-6">
            {[
              {
                name: "모던바이브 남자 오버핏 프린팅 반팔 티셔츠, 블랙, XL",
                price: "15,400",
                count: 1,
                image: "/product-black.jpg",
                purchaseDate: "2025. 6. 19",
              },
              {
                name: "모던바이브 남자 오버핏 프린팅 반팔 티셔츠, 화이트, XL",
                price: "15,400",
                count: 1,
                image: "/product-white.jpg",
                purchaseDate: "2025. 6. 19",
              },
              {
                name: "디알엠 남자 슬랙스 링클프리 구김없는 빅사이즈 밴딩 슬랙스~2XL, 10부 블랙(뒷밴딩), 2XL",
                price: "26,800",
                count: 1,
                image: "/product-pants.jpg",
                purchaseDate: "2025. 6. 19",
              },
              {
                name: "써쏘 남성용 히든밴딩 10부 슬랙스, 36, 블랙",
                price: "24,900",
                count: 1,
                image: "/product-slacks.jpg",
                purchaseDate: "2025. 6. 19",
              },
            ].map((item, i) => (
              <li key={i} className="flex justify-between items-center gap-4">
                <div className="flex gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded border object-cover"
                  />
                  <div className="text-sm space-y-1">
                    <div>
                      <span>{item.name}</span>
                    </div>
                    <div className="text-gray-500">
                      {item.price}원 · {item.count}개
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                  <Button variant="outline" size="sm">
                    장바구니 담기
                  </Button>

                  <p>구매일자: {item.purchaseDate}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
