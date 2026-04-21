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

interface AddressType {
  address: string;
  address_name: string;
  created_at: string | null;
  delivery_instruction: string | null;
  detail_address: string | null;
  id: string;
  is_default: boolean | null;
  postal_code: string;
  receiver_name: string;
  receiver_phone: string;
  user_id: string | null;
}

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
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-semibold mb-2">배송지 관리</h2>

      <div className="border-4 border-gray-200 p-5 rounded-sm mb-4 text-sm text-gray-600 leading-relaxed">
        <h2 className="font-bold text-gray-800 mb-2 border-b border-gray-200 pb-1">
          배송 주소록 유의사항
        </h2>
        <ul className="space-y-1">
          <li>
            <span className="pr-2">-</span>
            배송 주소록은 최대 <span className="font-semibold">10개</span>까지
            등록할 수 있습니다.
          </li>
          <li>
            <span className="pr-2">-</span>기본 배송지 설정 시 해당 주소가 결제
            시 최상단에 자동으로 노출됩니다.
          </li>
        </ul>
      </div>

      <div className="overflow-x-auto border-t-2 border-slate-700">
        <table className="w-full text-sm text-center border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-gray-700">
              <th className="py-3 px-2 w-12">
                <input
                  type="checkbox"
                  className="w-4 h-4 cursor-pointer"
                  checked={
                    !!(
                      addresses &&
                      addresses.length > 0 &&
                      selectedItems.length === addresses.length
                    )
                  }
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="py-3 px-2 font-medium border-x border-gray-200">
                기본 설정
              </th>
              <th className="py-3 px-2 font-medium border-x border-gray-200">
                배송지명
              </th>
              <th className="py-3 px-2 font-medium border-x border-gray-200">
                수령인
              </th>
              <th className="py-3 px-2 font-medium border-x border-gray-200">
                휴대전화
              </th>
              <th className="py-3 px-2 font-medium border-x border-gray-200">
                주소
              </th>
              <th className="py-3 px-2 font-medium">배송지관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-10 text-gray-500">
                  데이터를 불러오는 중입니다...
                </td>
              </tr>
            ) : addresses?.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-gray-500">
                  등록된 배송지가 없습니다.
                </td>
              </tr>
            ) : (
              addresses?.map((addr: AddressType) => (
                <tr
                  key={addr.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 cursor-pointer"
                      checked={
                        addr.id ? selectedItems.includes(addr.id) : false
                      }
                      onChange={() => toggleItemSelection(addr.id)}
                    />
                  </td>
                  <td className="py-4 px-2 border-x border-gray-100">
                    <span
                      className={`px-3 py-1 rounded text-xs border ${addr.is_default ? "bg-slate-500 text-white border-slate-600" : "bg-white text-gray-500 border-gray-300"}`}
                    >
                      {addr.is_default ? "기본" : "해제"}
                    </span>
                  </td>
                  <td className="py-4 px-2 border-x border-gray-100 font-medium text-gray-800">
                    {addr.address_name}
                  </td>
                  <td className="py-4 px-2 border-x border-gray-100">
                    {addr.receiver_name}
                  </td>
                  <td className="py-4 px-2 border-x border-gray-100">
                    {addr.receiver_phone || "-"}
                  </td>
                  <td className="py-4 px-4 border-x border-gray-100 text-left">
                    <span className="text-blue-600 font-mono">
                      ({addr.postal_code})
                    </span>{" "}
                    {addr.address} {addr.detail_address}
                  </td>
                  <td className="py-4 px-2 space-x-1">
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="px-3 py-1.5 bg-slate-700 text-white text-xs rounded hover:bg-slate-800"
                    >
                      적용
                    </button>
                    <button className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50">
                      수정
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handleDelSelectAddresses}
          className="px-4 py-2 border border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          선택 주소록 삭제 ({selectedItems.length})
        </button>
        <button
          onClick={() => router.push("/mypage/delivery/regist")}
          className="px-6 py-2 bg-slate-600 text-white text-sm font-medium rounded hover:bg-slate-700"
        >
          배송지등록
        </button>
      </div>
    </section>
  );
}
