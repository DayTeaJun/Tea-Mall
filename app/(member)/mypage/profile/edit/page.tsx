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

export default function EditProfilePage() {
  const { user } = useAuthStore();
  const { data, isLoading } = useMyProfileQuery(user?.id);
  const { mutate: updateProfile, isPending } = useUpdateMyProfileMutation(
    user?.id,
  );

  const [userName, setUserName] = useState(data?.user_name || "");
  const [phone, setPhone] = useState(data?.phone || "");
  const [address, setAddress] = useState(data?.address || "");

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
        address,
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
          <label className="font-bold text-xl">기본 배송 주소</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border-b py-1 text-sm"
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          className="bg-green-700 text-white px-6 py-2 rounded font-semibold"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </section>
  );
}
