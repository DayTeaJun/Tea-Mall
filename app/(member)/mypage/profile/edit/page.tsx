"use client";

import { useEffect, useState } from "react";
import {
  uploadImageToStorageProfile,
  useMyProfileQuery,
  useUpdateMyProfileMutation,
} from "@/lib/queries/auth";
import { useAuthStore } from "@/lib/store/useAuthStore";
import ImagePreviews from "./_components/ImagePreview_Profile";
import { ImgPreview } from "@/hooks/useImagePreview";
import { toast } from "sonner";
import DaumPost from "../../../../../components/common/AddressSearch";
import { useRouter } from "next/navigation";
import PasswordGate, {
  hasValidProfileEditVerification,
} from "./_components/PasswordGate";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data, isLoading } = useMyProfileQuery(user?.id);
  const { mutate: updateProfile, isPending } = useUpdateMyProfileMutation(
    user?.id,
  );

  const InitialPhone1 = data?.phone.split("-")[0];
  const InitialPhone2 = data?.phone.split("-")[1];
  const InitialPhone3 = data?.phone.split("-")[2];

  const [userName, setUserName] = useState(data?.user_name || "");

  const [phone1, setPhone1] = useState(InitialPhone1 || "");
  const [phone2, setPhone2] = useState(InitialPhone2 || "");
  const [phone3, setPhone3] = useState(InitialPhone3 || "");

  const fullPhone = `${phone1}-${phone2}-${phone3}`;

  const [address, setAddress] = useState(data?.address || "");
  const [detailAddress, setDetailAddress] = useState("");

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDetailAddressOpen, setIsDetailAddressOpen] = useState(false);

  const [profileImage, setProfileImage] = useState(
    data?.profile_image_url || "",
  );

  const { imageSrc, imgUrl, onUpload } = ImgPreview();

  const handleProfileImageChange = (file: File) => {
    onUpload(file);
    setProfileImage("");
  };

  const handleSubmit = async () => {
    if (!userName || !user) {
      toast.info("모든 필수 항목을 입력해 주세요.");
      return;
    }

    if (!phone1 || !phone2 || !phone3) {
      toast.info("전화번호를 전부 입력해 주세요.");
      return;
    }

    try {
      const imageUrl = imgUrl
        ? await uploadImageToStorageProfile(user.id, imgUrl)
        : profileImage || null;

      updateProfile({
        id: user.id,
        phone: fullPhone,
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

  const isOAuthUser = (user?: any) => {
    if (!user) return false;

    const p = user.app_metadata?.provider;
    if (p && p !== "email") return true;

    console.log(p);

    const identities: Array<{ provider?: string }> = user.identities ?? [];
    return identities.some((id) => id.provider && id.provider !== "email");
  };

  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (isOAuthUser(user)) {
      setIsVerified(true);
      return;
    }
    setIsVerified(hasValidProfileEditVerification());
  }, [user]);

  if (!isVerified) {
    return <PasswordGate onVerified={() => setIsVerified(true)} />;
  }

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold mb-2">회원정보 수정</h2>

      <div className="flex flex-col gap-6">
        <ImagePreviews
          imageSrc={imageSrc || ""}
          onUpload={handleProfileImageChange}
          editImage={data?.profile_image_url || ""}
        />

        <div className="flex flex-col gap-2 mb-4">
          <label className="font-bold text-xl">이름</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="border-b py-1 text-sm w-40 pl-2"
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <label className="font-bold text-xl">전화번호</label>
          <div className="flex items-center gap-2 font-bold">
            <input
              type="tel"
              maxLength={3}
              value={phone1}
              onChange={(e) => setPhone1(e.target.value.replace(/\D/, ""))}
              className="border-b py-1 text-sm w-16 text-center"
              placeholder="010"
            />
            <span>-</span>
            <input
              type="tel"
              maxLength={4}
              value={phone2}
              onChange={(e) => setPhone2(e.target.value.replace(/\D/, ""))}
              className="border-b py-1 text-sm w-20 text-center"
            />
            <span>-</span>
            <input
              type="tel"
              maxLength={4}
              value={phone3}
              onChange={(e) => setPhone3(e.target.value.replace(/\D/, ""))}
              className="border-b py-1 text-sm w-20 text-center"
            />
          </div>
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
