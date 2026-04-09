"use client";

import { useGetOrders } from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { ArrowRight, LoaderCircle, Package, PackageX } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  name: string;
  image_url: string | null;
}
interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  size: string | null;
  delivery_status: string | null;
  products: Product | null;
}

function LatestOrderLists() {
  const router = useRouter();
  const { user } = useAuthStore();
  const LIMIT = 10;

  const { data: orders, isLoading } = useGetOrders(
    user?.id ?? "",
    {},
    1,
    LIMIT,
    3,
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "배송중":
        return "text-blue-600";
      case "결제완료":
        return "text-green-600";
      case "배송완료":
        return "text-gray-600";
      case "취소됨":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="w-full bg-white p-6 flex flex-col gap-4 rounded">
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold text-gray-800">최근 주문 목록</p>
        <button
          onClick={() => router.push("/manage/orderList?query=&page=1")}
          className="group flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-all duration-300"
        >
          <span className="transition-all duration-300">전체 보기</span>
          <ArrowRight
            size={14}
            className="transform transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
          />
        </button>
      </div>

      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
          <LoaderCircle size={48} className="animate-spin mb-4" />
          <p className="text-sm">주문목록을 불러오는 중...</p>
        </div>
      ) : orders?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <PackageX size={48} className="mb-4" />
          <p>주문 내역이 없습니다.</p>
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-sm">
              <th className="py-3 px-2 font-medium w-[22%]">상품정보</th>
              <th className="py-3 px-2 font-medium w-[13%]">고객명</th>
              <th className="py-3 px-2 font-medium w-[30%]">주문번호</th>
              <th className="py-3 px-2 font-medium w-[15%]">주문일자</th>
              <th className="py-3 px-2 font-medium w-[10%]">결제금액</th>
              <th className="py-3 px-2 font-medium text-center w-[10%]">
                상태
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {orders?.data?.map((order) => {
              const firstItem = order.order_items?.[0];
              const itemCount = order.order_items?.length || 0;
              const totalPrice = order.order_items?.reduce(
                (acc: number, item: OrderItem) =>
                  acc + item.price * item.quantity,
                0,
              );
              return (
                <tr
                  key={order.id}
                  onClick={() =>
                    router.push(
                      `/manage/orderList/orderDetail?orderId=${order.id}`,
                    )
                  }
                  className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-2 font-semibold">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 bg-white border border-gray-200 flex-shrink-0">
                        {firstItem?.products?.image_url ? (
                          <Image
                            fill
                            src={firstItem.products.image_url}
                            alt="product"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package size={18} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate group-hover:underline">
                          {firstItem?.products?.name || "상품 정보 없음"}
                        </span>
                        {itemCount > 1 && (
                          <span className="text-[11px] text-gray-400 mt-0.5">
                            외 {itemCount - 1}건의 상품
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 font-semibold">{order.user_name}</td>

                  <td className="py-4 px-2 font-mono text-gray-600">
                    {order.id}
                  </td>

                  <td className="py-4 text-gray-500 font-mono text-[13px]">
                    {order.created_at &&
                      new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2 font-medium">
                    {totalPrice.toLocaleString()}원
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`px-2 py-1 rounded-md text-12 font-medium flex justify-center ${getStatusStyle(firstItem?.delivery_status || "결제완료")}`}
                    >
                      {firstItem?.delivery_status || "결제완료"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LatestOrderLists;
