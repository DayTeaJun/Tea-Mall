"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Package, Loader2, ChevronRight } from "lucide-react";
import ReactPaginate from "react-paginate";
import { useGetOrders } from "@/lib/queries/auth";
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

interface OrderData {
  id: string;
  created_at: string;
  user_id: string;
  user_name: string | null;
  email: string | null;
  order_items: OrderItem[];
}

interface UserOrderListsProps {
  userId: string;
}

function UserOrderLists({ userId }: UserOrderListsProps) {
  const [page, setPage] = useState(1);
  const LIMIT = 10;
  const router = useRouter();

  const { data, isLoading } = useGetOrders(userId, {}, page, LIMIT, 1);

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  const orders = (data?.data as OrderData[]) || [];
  const totalCount = data?.count || 0;
  const pageCount = Math.ceil(totalCount / LIMIT);

  return (
    <section className="col-span-2 flex flex-col p-4 pl-2">
      <div className="h-full border border-gray-200 bg-white p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">최근 주문 목록</h2>
          <span className="text-sm text-gray-500 font-medium">
            총 {totalCount}건
          </span>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border-t border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[12px] text-gray-500 uppercase">
                  <th className="py-3 px-4 font-bold w-[30%]">상품 정보</th>
                  <th className="py-3 px-4 font-bold text-center">주문일자</th>
                  <th className="py-3 px-4 font-bold text-center">결제금액</th>
                  <th className="py-3 px-4 font-bold text-center">배송상태</th>
                  <th className="py-3 px-4 font-bold text-center">주문 상세</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {orders.length > 0 ? (
                  orders.map((order) => {
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
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
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
                              <span className="font-bold text-gray-900 truncate">
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
                        <td className="py-4 px-4 text-center text-gray-500 font-mono text-[13px]">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-center font-bold text-gray-900">
                          {totalPrice.toLocaleString()}원
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="text-[11px]">
                            {firstItem?.delivery_status || "결제완료"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() =>
                              router.push(
                                `/manage/orderList/orderDetail?orderId=${order.id}`,
                              )
                            }
                            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center min-h-[400px] w-full text-gray-400 bg-white">
                        <div className="p-2 bg-gray-50 rounded-full mb-4">
                          <Package size={30} className="text-gray-300" />
                        </div>
                        <p className="text-base font-medium text-gray-400">
                          주문 내역이 존재하지 않습니다.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className="mt-8 flex justify-center border-t border-gray-100 pt-6">
              <ReactPaginate
                breakLabel="..."
                nextLabel=">"
                onPageChange={(e) => setPage(e.selected + 1)}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                previousLabel="<"
                containerClassName="flex items-center gap-1"
                pageLinkClassName="px-3 py-1 text-[13px] border border-gray-200 text-gray-600"
                activeLinkClassName="bg-black text-white border-black font-bold cursor-pointer"
                previousLinkClassName="px-3 py-1 text-[13px] border border-gray-200"
                nextLinkClassName="px-3 py-1 text-[13px] border border-gray-200"
                disabledLinkClassName="opacity-30 cursor-default"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default UserOrderLists;
