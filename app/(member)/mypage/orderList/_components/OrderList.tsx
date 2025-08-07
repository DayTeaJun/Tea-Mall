"use client";

import ReactPaginate from "react-paginate";
import CartBtn from "@/components/common/buttons/CartBtn";
import Modal from "@/components/common/Modal";
import { useGetOrders, useUpdateCancelOrderItem } from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { LoaderCircle, PackageX, Search, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function OrderList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [recent6Months, setRecent6Months] = useState(true);

  const currentPage = Number(searchParams.get("page") ?? 1);

  const handlePageChange = (selected: { selected: number }) => {
    const newPage = selected.selected + 1; // react-paginate는 0-based index
    router.push(`/mypage/orderList?page=${newPage}`);
  };

  const { data: orders, isLoading } = useGetOrders(
    user?.id ?? "",
    {
      recent6Months,
      year: selectedYear ?? undefined,
    },
    currentPage,
    1,
  );

  const totalCount = orders?.count ?? 0;
  const pageCount = Math.ceil(totalCount / 1);

  const { mutate: cancelOrderItem } = useUpdateCancelOrderItem(user?.id ?? "");

  const [isCancelOrderModal, setIsCancelOrderModal] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<{
    orderItemId: string;
    deliveryStatus: string;
  } | null>(null);

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
    setRecent6Months(false);
  };

  const handleRecentClick = () => {
    setSelectedYear(null);
    setRecent6Months(true);
  };

  const handleCancelOrder = () => {
    if (!cancelTarget || !user?.id) {
      toast.error("주문 정보를 찾을 수 없습니다.");
      return;
    }

    const { orderItemId } = cancelTarget;

    cancelOrderItem(orderItemId);
    setIsCancelOrderModal(false);
    setCancelTarget(null);
  };

  const statusColors: Record<string, string> = {
    결제완료: "text-gray-700",
    배송준비중: "text-blue-700",
    배송중: "text-yellow-700",
    배송완료: "text-green-700",
    취소됨: "text-red-700",
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-4">
      <h2 className="text-xl font-bold">주문 내역</h2>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="주문한 상품을 검색할 수 있습니다."
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
          <p className="text-sm">주문목록 정보를 불러오고 있습니다...</p>
        </div>
      ) : orders?.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <PackageX size={48} className="mb-4" />
          <h3 className="text-lg font-semibold mb-2">주문 내역이 없습니다</h3>
          <p className="text-sm mb-6">
            아직 상품을 구매하신 이력이 없습니다. 쇼핑을 시작해보세요!
          </p>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 border rounded-md text-sm hover:bg-gray-100 transition"
          >
            <ShoppingCart size={16} />
            쇼핑하러 가기
          </button>
        </div>
      ) : (
        orders?.data?.map((order) => (
          <div key={order.id} className="border rounded-md p-4">
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
                onClick={() =>
                  router.push(
                    `/mypage/orderList/orderDetail?orderId=${order.id}`,
                  )
                }
                type="button"
                className="text-sm p-0 h-auto hover:underline cursor-pointer"
              >
                주문 상세보기 &gt;
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {order.order_items.map((item, i) => (
                <li
                  key={i}
                  className={`p-4 flex flex-col gap-4 bg-white ${
                    order.order_items.length - i !== 1 ? "border-b" : ""
                  }`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <div
                      className="flex flex-col gap-2 cursor-pointer flex-1 justify-between"
                      onClick={() =>
                        router.push(`/products/${item.product_id}`)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.products.image_url ?? ""}
                            alt={item.products.name}
                            width={80}
                            height={80}
                            className="rounded border object-cover w-20 h-20"
                          />
                          <div className="flex flex-col gap-1 justify-center">
                            <p className="text-sm font-medium flex gap-1 items-center">
                              {item.products.name}
                              <span
                                className={`text-xs font-bold rounded-full w-fit ${
                                  statusColors[
                                    item.delivery_status ?? "결제완료"
                                  ]
                                }`}
                              >
                                · {item.delivery_status ?? "결제완료"}
                              </span>
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.price.toLocaleString()}원 · {item.quantity}
                              개 · 사이즈: {item.size}
                            </p>
                          </div>
                        </div>

                        <CartBtn
                          className="w-30 h-fit border my-auto rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                          productId={item.product_id}
                          quantity={1}
                          selectedSize={item.size || ""}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-center gap-2 border-l pl-4 self-stretch">
                      {item.delivery_status === "배송중" && (
                        <button
                          onClick={() =>
                            toast.info("배송 현황은 준비중 입니다.")
                          }
                          className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                        >
                          배송 현황 보기
                        </button>
                      )}

                      {item.delivery_status !== "배송완료" && (
                        <button
                          onClick={() => {
                            if (item.delivery_status === "취소됨") {
                              toast.error("이미 취소된 주문입니다.");
                              return;
                            }

                            setCancelTarget({
                              orderItemId: item.id,
                              deliveryStatus: item.delivery_status || "",
                            });
                            setIsCancelOrderModal(true);
                          }}
                          className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                        >
                          주문 취소
                        </button>
                      )}

                      {/* {item.delivery_status === "취소됨" && (
                        <p className="w-30 px-2 py-1 text-[14px] text-gray-900 text-center">
                          주문 취소 완료
                        </p>
                      )} */}

                      {item.delivery_status === "배송완료" && (
                        <button
                          onClick={() =>
                            toast.info("교환, 반품 신청은 준비중 입니다.")
                          }
                          className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer"
                        >
                          교환, 반품 신청
                        </button>
                      )}

                      {item.delivery_status === "배송완료" && (
                        <button
                          onClick={() =>
                            router.push(`/productReview/${item.product_id}`)
                          }
                          className="w-30 border rounded-md px-2 py-1 text-[14px] text-gray-700 hover:bg-gray-200 cursor-pointer "
                        >
                          리뷰 작성하기
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {pageCount > 1 && (
        <div className="mt-6 flex justify-center">
          <ReactPaginate
            onPageChange={handlePageChange}
            pageRangeDisplayed={3}
            pageCount={pageCount}
            forcePage={currentPage - 1}
            marginPagesDisplayed={1}
            previousLabel={"이전"}
            nextLabel={"다음"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            containerClassName={"pagination"}
            activeClassName={"active"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
          />
        </div>
      )}

      <Modal
        isOpen={isCancelOrderModal}
        onClose={() => {
          setIsCancelOrderModal(false);
          setCancelTarget(null);
        }}
        title="정말 주문을 취소하시겠습니까?"
        description={`결제완료 이후의 주문만 취소할 수 있으며,\n취소 후 복구는 불가능합니다.`}
      >
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setIsCancelOrderModal(false);
              setCancelTarget(null);
            }}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            아니요
          </button>
          <button
            onClick={handleCancelOrder}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            주문 취소
          </button>
        </div>
      </Modal>
    </div>
  );
}
