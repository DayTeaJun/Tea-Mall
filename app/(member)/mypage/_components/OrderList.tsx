"use client";

import { PackageX, Search, ShoppingCart } from "lucide-react";
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
        <button
          type="button"
          className="p-2 text-black border rounded-md cursor-pointer"
        >
          <Search size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          className="bg-gray-300 text-white px-4 py-2 rounded-md"
        >
          최근 6개월
        </button>
        {["2025", "2024", "2023", "2022", "2021", "2020"].map((year) => (
          <button
            key={year}
            className="text-gray-700 hover:bg-gray-300 hover:text-white px-4 py-2 rounded-md cursor-pointer"
          >
            {year}
          </button>
        ))}
      </div>

      {orders.length > 0 ? (
        orders.map((order) => (
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
              <button
                type="button"
                className="text-sm p-0 h-auto hover:underline cursor-pointer"
              >
                주문 상세보기 &gt;
              </button>
            </div>

            <ul className="space-y-4">
              {order.order_items.map((item, i) => (
                <li
                  key={i}
                  className="border rounded-md p-4 flex flex-col gap-4 bg-white"
                >
                  <div className="text-sm text-gray-700 font-semibold">
                    구매일자:{" "}
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "알 수 없음"}
                  </div>

                  <div className="flex justify-between items-center gap-4">
                    <div
                      className="flex gap-4 cursor-pointer flex-1"
                      onClick={() =>
                        router.push(`/products/${item.product_id}`)
                      }
                    >
                      <Image
                        src={item.products.image_url ?? "/default-product.jpg"}
                        alt={item.products.name}
                        width={80}
                        height={80}
                        className="rounded border object-cover"
                      />
                      <div className="flex flex-col justify-center">
                        <p className="text-sm font-medium">
                          {item.products.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.price.toLocaleString()}원 · {item.quantity}개
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0 border-l pl-4">
                      <button
                        type="button"
                        className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                      >
                        배송조회
                      </button>
                      <button
                        type="button"
                        className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                      >
                        교환, 반품 신청
                      </button>
                      <button
                        className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                        onClick={() =>
                          router.push(`/productReview/${item.product_id}`)
                        }
                      >
                        리뷰 작성하기
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <PackageX size={48} className="mb-4" />
          <h3 className="text-lg font-semibold mb-2">주문 내역이 없습니다</h3>
          <p className="text-sm mb-6">
            아직 상품을 구매하신 이력이 없습니다. 쇼핑을 시작해보세요!
          </p>
          <button
            onClick={() => router.push("/products")}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-100 transition"
          >
            <ShoppingCart size={16} />
            쇼핑하러 가기
          </button>
        </div>
      )}
    </div>
  );
}
