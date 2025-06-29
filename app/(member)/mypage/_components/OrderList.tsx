"use client";

import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  products: {
    name: string;
    image_url: string | null;
  };
}

interface Order {
  id: string;
  created_at: string | null;
  order_items: OrderItem[];
}

export default function OrderList({ orders }: { orders: Order[] }) {
  const router = useRouter();

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

      {orders.map((order) => (
        <div key={order.id} className="border rounded-md p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-sm text-gray-800">
              {order.created_at
                ? new Date(order.created_at).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "알 수 없음"}{" "}
              주문
            </h3>
            <Button variant="link" className="text-sm p-0 h-auto">
              주문 상세보기 &gt;
            </Button>
          </div>

          <div className="bg-gray-50 rounded-md p-4">
            <h4 className="font-semibold text-sm mb-4">배송완료</h4>

            <ul className="space-y-6">
              {order.order_items.map((item, i) => (
                <li key={i} className="flex justify-between items-center gap-4">
                  <div
                    className="flex gap-4 cursor-pointer w-full"
                    onClick={() => router.push(`/products/${item.product_id}`)}
                  >
                    <Image
                      src={item.products.image_url ?? "/default-product.jpg"}
                      alt={item.products.name}
                      width={80}
                      height={80}
                      className="rounded border object-cover"
                    />
                    <div className="text-sm space-y-1">
                      <div>
                        <span>{item.products.name}</span>
                      </div>
                      <div className="text-gray-500">
                        {item.price.toLocaleString()}원 · {item.quantity}개
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 shrink-0">
                    <Button variant="outline" size="sm">
                      장바구니 담기
                    </Button>
                    <p>
                      구매일자:{" "}
                      {order.created_at
                        ? new Date(order.created_at).toLocaleDateString()
                        : "알 수 없음"}
                    </p>
                  </div>

                  <div className="">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        router.push(`/productReview/${item.product_id}`)
                      }
                    >
                      상품 리뷰 작성
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
