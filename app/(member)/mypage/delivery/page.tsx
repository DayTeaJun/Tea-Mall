"use client";

import {
  useDelDeliveryAddressMutation,
  useGetAddressList,
  usePostDefaultDeliveryAddressMutation,
} from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

export default function DeliveryPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data: addresses, isLoading } = useGetAddressList(user?.id);
  const { mutate: setDefaultAddress } = usePostDefaultDeliveryAddressMutation(
    user?.id || "",
  );

  const { mutate: deleteAddress } = useDelDeliveryAddressMutation(
    user?.id || "",
  );

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === addresses?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(addresses?.map((addr) => addr.id) ?? []);
    }
  };

  const handleDelSelectAddresses = () => {
    if (selectedItems.length === 0) {
      toast.error("삭제할 항목을 선택하세요.");
      return;
    }

    const hasDefault = addresses
      ?.filter((addr) => selectedItems.includes(addr.id))
      .some((addr) => addr.is_default);

    if (hasDefault) {
      toast.error(
        "기본 배송지는 삭제할 수 없습니다. 다른 주소를 기본으로 변경 후 삭제해주세요.",
      );
      return;
    }

    if (
      confirm(`선택한 ${selectedItems.length}개의 배송지를 삭제하시겠습니까?`)
    ) {
      selectedItems.forEach((id) => deleteAddress(id));
      setSelectedItems([]);
    }

    toast.success("선택한 배송지가 삭제되었습니다.");
  };

  return (
    <section className="flex flex-col gap-2 p-2 sm:p-0">
      <h2 className="text-xl font-semibold mb-2">배송지 관리</h2>

      <div className="border-4 border-gray-200 p-4 sm:p-5 rounded-sm mb-4 text-[13px] sm:text-sm text-gray-600 leading-relaxed">
        <h2 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
          배송 주소록 유의사항
        </h2>
        <ul className="space-y-1">
          <li>
            - 배송 주소록은 최대 <span className="font-semibold">10개</span>까지
            등록할 수 있습니다.
          </li>
          <li>- 기본 배송지 설정 시 결제 시 최상단에 자동으로 노출됩니다.</li>
        </ul>
      </div>

      <div className="hidden sm:block overflow-x-auto border-t-2 border-slate-700">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-gray-700">
              <th className="py-3 px-2 w-12">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={
                    !!(
                      addresses?.length &&
                      selectedItems.length === addresses.length
                    )
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="py-3 px-2 font-medium border-gray-200 w-24">
                배송지명
              </th>
              <th className="py-3 px-2 font-medium border-gray-200 w-20">
                수령인
              </th>
              <th className="py-3 px-2 font-medium border-gray-200 w-32">
                휴대전화
              </th>
              <th className="py-3 px-2 font-medium border-gray-200">주소</th>
              <th className="py-3 px-2 font-medium w-40">관리</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-10 text-gray-500">
                  불러오는 중...
                </td>
              </tr>
            ) : (
              addresses?.map((addr) => (
                <tr
                  key={addr.id}
                  className="hover:bg-gray-50 transition-colors text-sm border-b border-gray-100"
                >
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(addr.id)}
                      onChange={() => toggleItemSelection(addr.id)}
                      className="w-4 h-4"
                    />
                  </td>
                  <td className="py-4 px-2 font-medium text-gray-800">
                    <div className="flex flex-col items-center gap-1">
                      <span>{addr.address_name}</span>
                      {addr.is_default && (
                        <span className="text-[11px] px-1.5 py-0.5 border border-gray-200 text-gray-700 font-bold">
                          기본 배송지
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-gray-600">
                    {addr.receiver_name}
                  </td>
                  <td className="py-4 px-2 text-gray-600">
                    {addr.receiver_phone || "-"}
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-blue-600 mr-1">
                      [{addr.postal_code}]{" "}
                    </span>
                    {addr.address} {addr.detail_address}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-col gap-1.5 items-center">
                      {!addr.is_default ? (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="w-28 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
                        >
                          기본 배송지 설정
                        </button>
                      ) : (
                        <div className="w-28 py-1.5 text-gray-700 text-xs">
                          기본 주소지
                        </div>
                      )}
                      <button
                        onClick={() =>
                          router.push(`/mypage/delivery/edit/${addr.id}`)
                        }
                        className="w-28 py-1.5 bg-slate-700 text-white text-xs rounded hover:bg-slate-800"
                      >
                        수정하기
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col gap-3 border-t-2 border-slate-700 pt-3">
        {isLoading ? (
          <div className="py-10 text-center text-gray-500">
            데이터를 불러오는 중입니다...
          </div>
        ) : addresses?.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            등록된 배송지가 없습니다.
          </div>
        ) : (
          addresses?.map((addr) => (
            <div
              key={addr.id}
              className="border border-gray-200 p-4 bg-white relative"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="w-5 h-5"
                    checked={selectedItems.includes(addr.id)}
                    onChange={() => toggleItemSelection(addr.id)}
                  />
                  <h3 className="font-bold text-gray-900">
                    {addr.address_name}
                  </h3>
                  {addr.is_default && (
                    <span className="bg-slate-600 text-white text-[10px] px-2 py-0.5 rounded">
                      기본
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p className="font-medium text-gray-800">
                  {addr.receiver_name} | {addr.receiver_phone || "-"}
                </p>
                <p className="text-gray-500">
                  <span className="text-blue-600 font-mono text-xs">
                    [{addr.postal_code}]
                  </span>{" "}
                  {addr.address} {addr.detail_address}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setDefaultAddress(addr.id)}
                  className={`flex-1 py-2 text-xs rounded border ${addr.is_default ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-slate-700 text-white border-slate-700"}`}
                  disabled={!!addr.is_default}
                >
                  {addr.is_default ? "기본 설정됨" : "기본 배송지로 설정"}
                </button>
                <button
                  onClick={() =>
                    router.push(`/mypage/delivery/edit/${addr.id}`)
                  }
                  className="px-4 py-2 border border-gray-300 text-gray-600 text-xs rounded"
                >
                  수정
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 sm:gap-0">
        <button
          onClick={handleDelSelectAddresses}
          className="w-full sm:w-auto px-4 py-3 sm:py-2 border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          선택 주소록 삭제 ({selectedItems.length})
        </button>
        <button
          onClick={() => router.push("/mypage/delivery/regist")}
          className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-slate-600 text-white text-sm font-medium rounded hover:bg-slate-700 shadow-sm"
        >
          새 배송지 등록
        </button>
      </div>
    </section>
  );
}
