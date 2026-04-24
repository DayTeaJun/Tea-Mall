import {
  useGetAddressList,
  usePostDefaultDeliveryAddressMutation,
} from "@/lib/queries/auth";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  userId?: string;
  onClose: () => void;
}

export default function AddressListModal({ userId, onClose }: Props) {
  const router = useRouter();

  const { data: addresses, isLoading } = useGetAddressList(userId);
  const { mutate: setDefaultAddress } = usePostDefaultDeliveryAddressMutation(
    userId || "",
  );

  const handleDeliveryChange = (id: string) => {
    setDefaultAddress(id);

    onClose();
  };

  if (isLoading) {
    return (
      <section className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-gray-300" size={32} />
      </section>
    );
  }

  const handleDeliveryEdit = (id: string) => {
    if (confirm("배송지 수정 페이지로 이동하시겠습니까?")) {
      router.push(`/mypage/delivery/edit/${id}`);
    }
  };

  const handleDeleiveryAdd = () => {
    if (confirm("배송지 추가 페이지로 이동하시겠습니까?")) {
      router.push("/mypage/delivery/regist");
    }
  };

  return (
    <section className="flex flex-col gap-2">
      {addresses?.map((addr) => {
        return (
          <div
            key={addr.id}
            className={`${addr.is_default === true ? "border-green-400 border-2" : ""} border p-3 flex flex-col gap-2`}
          >
            <div className="flex gap-4">
              <p className="font-bold">{addr.address_name}</p>
              <p className="text-gray-500">-</p>
              <p className="text-gray-500">{addr.receiver_name}</p>
            </div>
            {addr.is_default === true && (
              <p className="text-13 font-bold border rounded-2xl px-2 py-0.5 w-fit -ml-1">
                기본 배송지
              </p>
            )}

            <p className="text-16">{`(${addr.postal_code}) ${addr.address}, ${addr.detail_address}`}</p>

            <p>{addr.delivery_instruction}</p>

            <div className="flex justify-between text-14">
              <button
                className="px-5 py-2 border border-gray-200 text-green-400"
                type="button"
                onClick={() => handleDeliveryEdit(addr.id)}
              >
                수정
              </button>
              {!addr.is_default && (
                <button
                  onClick={() => handleDeliveryChange(addr.id)}
                  className="px-5 py-2 border border-gray-200 text-white bg-green-400"
                  type="button"
                >
                  선택
                </button>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        className="flex gap-2 p-2 w-full border justify-center items-center border-gray-400 hover:bg-gray-50 duration-200"
        onClick={() => handleDeleiveryAdd()}
      >
        <Plus size={18} /> 새 배송지 추가하기
      </button>
    </section>
  );
}
