import { ArrowRight } from "lucide-react";
import React from "react";

function LatestOrderLists() {
  const mockOrders = [
    {
      id: "ORD-20260321-01",
      customer: "김철수",
      date: "2026-03-21",
      price: 150000,
      status: "배송중",
    },
    {
      id: "ORD-20260320-05",
      customer: "이영희",
      date: "2026-03-20",
      price: 45000,
      status: "결제완료",
    },
    {
      id: "ORD-20260320-02",
      customer: "박민수",
      date: "2026-03-20",
      price: 89000,
      status: "배송완료",
    },
    {
      id: "ORD-20260319-11",
      customer: "최지우",
      date: "2026-03-19",
      price: 12000,
      status: "취소됨",
    },
    {
      id: "ORD-20260318-07",
      customer: "정우성",
      date: "2026-03-18",
      price: 210000,
      status: "결제완료",
    },
  ];

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
        <button className="group flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-all duration-300">
          <span className="transition-all duration-300">전체 보기</span>
          <ArrowRight
            size={14}
            className="transform transition-transform duration-300 ease-in-out group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 text-sm">
              <th className="py-3 px-2 font-medium">주문번호</th>
              <th className="py-3 px-2 font-medium">고객명</th>
              <th className="py-3 px-2 font-medium">주문일자</th>
              <th className="py-3 px-2 font-medium">결제금액</th>
              <th className="py-3 px-2 font-medium text-center">상태</th>
              <th className="py-3 px-2 font-medium text-center">관리</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {mockOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-50 last:border-none hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-2 font-mono text-gray-600">
                  {order.id}
                </td>
                <td className="py-4 px-2 font-semibold">{order.customer}</td>
                <td className="py-4 px-2 text-gray-500">{order.date}</td>
                <td className="py-4 px-2 font-medium">
                  {order.price.toLocaleString()}원
                </td>
                <td className="py-4 px-2">
                  <span
                    className={`px-2 py-1 rounded-md text-12 font-medium flex justify-center ${getStatusStyle(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 px-2 text-center">
                  <button className="text-xs px-3 py-1 border border-gray-200 rounded hover:bg-gray-200 transition-all">
                    상세보기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LatestOrderLists;
