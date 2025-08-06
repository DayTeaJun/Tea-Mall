"use client";

import { queryClient } from "@/components/providers/ReactQueryProvider";
import { updateDeliveryStatus } from "@/lib/actions/admin";
import { useGetOrders } from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { LoaderCircle, PackageX, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminOrderList() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [recent6Months, setRecent6Months] = useState(true);

  const { data: orders = [], isLoading } = useGetOrders(
    user?.id ?? "",
    { recent6Months, year: selectedYear ?? undefined },
    user?.level ?? 0,
  );

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setRecent6Months(false);
  };

  const handleRecentClick = () => {
    setSelectedYear(null);
    setRecent6Months(true);
  };

  const statusOptions = [
    "결제완료",
    "배송준비중",
    "배송중",
    "배송완료",
    "취소됨",
  ];

  const handleStatusChange = async (orderItemId: string, status: string) => {
    try {
      await updateDeliveryStatus(orderItemId, status);
      toast.success("배송 상태가 변경되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (err) {
      toast.error("배송 상태 변경 실패");
      console.error(err);
    }
  };

  if (user?.level !== 3) {
    return (
      <div className="text-center py-20 text-gray-600">
        관리자만 접근 가능한 페이지입니다.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">주문 관리</h2>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="주문자 이름 또는 이메일 검색"
          className="w-full px-4 py-2 border rounded-md text-sm"
        />
        <button className="p-2 text-black border rounded-md cursor-pointer">
          <Search size={20} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`px-4 py-2 rounded-md ${
            recent6Months
              ? "bg-gray-300 text-white"
              : "text-gray-700 hover:bg-gray-300 hover:text-white"
          }`}
          onClick={handleRecentClick}
        >
          최근 6개월
        </button>
        {Array.from({ length: 6 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return (
            <button
              key={year}
              onClick={() => handleYearClick(year)}
              className={`px-4 py-2 rounded-md cursor-pointer ${
                selectedYear === year
                  ? "bg-gray-300 text-white"
                  : "text-gray-700 hover:bg-gray-300 hover:text-white"
              }`}
            >
              {year}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center py-20 text-gray-600">
          <LoaderCircle size={48} className="animate-spin mb-4" />
          <p className="text-sm">주문목록을 불러오는 중...</p>
        </div>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <div key={order.id} className="border rounded-md p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col gap-1">
                <p className="font-semibold">
                  주문일:{" "}
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("ko-KR")
                    : "날짜 정보 없음"}
                </p>
                <p className="text-sm text-gray-500">
                  주문자: {order.user?.user_name} ({order.user?.email})
                </p>
              </div>
              <button
                onClick={() =>
                  router.push(
                    `/products/orderList/orderDetail?orderId=${order.id}`,
                  )
                }
                className="text-sm hover:underline"
              >
                주문 상세보기 &gt;
              </button>
            </div>

            <ul className="flex flex-col gap-3">
              {order.order_items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-center border-t pt-3"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={item.products.image_url ?? ""}
                      alt={item.products.name}
                      width={80}
                      height={80}
                      className="rounded border object-cover w-20 h-20"
                    />
                    <div>
                      <p className="font-medium">{item.products.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.price.toLocaleString()}원 · {item.quantity}개 ·
                        사이즈: {item.size}
                      </p>
                    </div>
                  </div>

                  <select
                    value={item.delivery_status ?? "결제완료"}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value)
                    }
                    className="border p-1 rounded text-sm"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-600">
          <PackageX size={48} className="mb-4" />
          <p>주문 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
