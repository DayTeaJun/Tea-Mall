"use client";

import { useMyProfileQuery } from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const { data, isLoading } = useMyProfileQuery(user?.id);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">내 정보</h2>
      <div className="flex flex-col gap-6">
        <div className="flex justify-center items-center w-20 h-20 rounded-full overflow-hidden border">
          {data?.profile_image_url ? (
            <Image
              src={data?.profile_image_url}
              alt="프로필 이미지"
              className="w-20 h-20 rounded-full object-cover"
              width={64}
              height={64}
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
            <span>{data?.phone}</span>
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
          <button className="bg-gray-300 px-4 p-1 rounded">
            비밀번호 재설정
          </button>
          <button className="bg-red-500 text-white px-4 p-1 rounded">
            회원탈퇴
          </button>
        </div>
      </div>
    </section>
  );
}
