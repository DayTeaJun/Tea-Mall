"use client";

import Modal from "@/components/common/Modal";
import { withdrawalUser } from "@/lib/actions/auth";
import { useMyProfileQuery } from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [isModal, setIsModal] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();

  const { data, isLoading } = useMyProfileQuery(user?.id);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  const handleDelete = async () => {
    const withrawal = await withdrawalUser();
    if (withrawal) {
      toast.success("성공적으로 회원 탈퇴되었습니다.");
      router.push("/");
    } else {
      toast.error("회원 탈퇴에 실패하였습니다. 관리자에게 문의 주세요");
    }

    setIsModal(false);
  };

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">내 정보</h2>
      <div className="flex flex-col gap-6">
        <div className="flex justify-center items-center w-25 h-25 rounded-full overflow-hidden border">
          {data?.profile_image_url ? (
            <Image
              src={data?.profile_image_url}
              alt="프로필 이미지"
              className="w-25 h-25 rounded-full object-cover"
              width={100}
              height={100}
            />
          ) : (
            <UserRound
              size={72}
              className="text-gray-400 bg-gray-200 rounded-full p-2"
            />
          )}
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <p className="font-bold text-xl">이름</p>
          <p>
            {data?.user_name}{" "}
            <span className="text-sm font-medium text-gray-400">
              {" "}
              - {data?.email}
            </span>
          </p>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <p className="font-bold text-xl">전화번호</p>
          {data?.phone ? (
            <span className="text-sm">{data.phone.split("-").join(" - ")}</span>
          ) : (
            <span className="text-gray-400">등록된 전화번호가 없습니다.</span>
          )}
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <p className="font-bold text-xl">기본 배송 주소</p>
          {data?.address ? (
            <span>{data?.address}</span>
          ) : (
            <span className="text-gray-400">등록된 주소가 없습니다.</span>
          )}
        </div>
      </div>

      <div className="flex mt-10 justify-between">
        <button
          onClick={() => router.push("/mypage/profile/edit")}
          className="bg-green-700 text-white px-4 p-1 rounded"
        >
          내 정보 수정
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => router.push("/mypage/profile/resetPassword")}
            className="bg-gray-300 px-4 p-1 rounded"
          >
            비밀번호 재설정
          </button>
          <button
            onClick={() => setIsModal(true)}
            className="bg-red-500 text-white px-4 p-1 rounded"
          >
            회원탈퇴
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        title="정말 탈퇴하시겠습니까?"
        description={`* 회원 정보는 모두 삭제되며 복구할 수 없습니다.\n(등록한 댓글 및 기록들은 자동으로 삭제되지 않습니다.)`}
      >
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsModal(false)}
            className="px-4 py-2 text-gray-600 hover:underline"
          >
            취소
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
          >
            탈퇴하기
          </button>
        </div>
      </Modal>
    </section>
  );
}
