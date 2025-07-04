"use client";

import { useState } from "react";
import {
  uploadImageToStorageProfile,
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import ImagePreviews from "./_components/ImagePreview_Profile";
import { ImgPreview } from "@/hooks/useImagePreview";
import { toast } from "sonner";
import DaumPost from "./_components/AddressSearch";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, isLoading } = useMyProfileQuery(user?.id);
  const { mutate: updateProfile, isPending } = useUpdateMyProfileMutation(
    user?.id,
  );

  const [userName, setUserName] = useState(data?.user_name || "");
  const [phone, setPhone] = useState(data?.phone || "");
  const [address, setAddress] = useState(data?.address || "");
  const [detailAddress, setDetailAddress] = useState("");

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDetailAddressOpen, setIsDetailAddressOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(
    data?.profile_image_url || "",
  );

  const { imageSrc, imgUrl, onUpload, onRemove } = ImgPreview();

  const handleProfileImageChange = (file: File) => {
    onUpload(file);
    setProfileImage("");
  };

  const handleProfileImageRemove = () => {
    onRemove();
    setProfileImage("");
  };

  const handleSubmit = async () => {
    if (!userName || !phone || !user) {
      toast.info("모든 필수 항목을 입력해 주세요.");
      return;
    }

    try {
      const imageUrl = imgUrl
        ? await uploadImageToStorageProfile(user.id, imgUrl)
        : profileImage || null;

      updateProfile({
        id: user.id,
        phone,
        user_name: userName,
        address: address
          ? address + (detailAddress ? `, ${detailAddress}` : "")
          : "",
        profile_image_url: imageUrl,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error("프로필 수정 실패:", err.message);
        toast.error("등록 중 오류: " + err.message);
      } else {
        console.error("프로필 수정 실패:", err);
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">프로필 수정</h2>

      <div className="flex flex-col gap-6">
        <ImagePreviews
          imageSrc={imageSrc || ""}
          onUpload={handleProfileImageChange}
          onRemove={handleProfileImageRemove}
          editImage={data?.profile_image_url || ""}
        />

        <div className="flex flex-col gap-2 mb-4">
          <label className="font-bold text-xl">이름</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border-b py-1 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <label className="font-bold text-xl">전화번호</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-b py-1 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <div className="flex gap-4 items-center">
            <label className="font-bold text-xl">기본 배송 주소</label>
            <button
              className="rounded border-gray-300 px-2 py-1 text-sm text-white hover:bg-gray-600 transition-colors bg-gray-500"
              onClick={() => setIsAddressModalOpen(!isAddressModalOpen)}
            >
              {isAddressModalOpen ? "변경 취소" : "배송지 변경"}
            </button>
          </div>
          <p className={`text-sm ${address ? "text-black" : "text-gray-500"}`}>
            {address || "등록된 주소 없음"}
          </p>

          {isDetailAddressOpen && (
            <input
              type="text"
              placeholder="상세 주소 (선택)"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              className="border-b py-1 text-sm"
            />
          )}
        </div>

        {isAddressModalOpen && (
          <DaumPost
            onComplete={(data) => {
              setAddress(data.address);
              setIsAddressModalOpen(false);
              setIsDetailAddressOpen(true);
            }}
          />
        )}
      </div>

      <div className="flex justify-end gap-2 mt-10">
        <button
          className="bg-red-500 text-white px-4 py-1 rounded"
          onClick={() => router.push("/mypage/profile")}
        >
          취소
        </button>
        <button
          className="bg-green-700 text-white px-4 py-1 rounded"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </section>
  );
}
