"use client";

import { Input } from "@/components/ui/input";
import { ImgPreview } from "@/hooks/useImagePrevew";
import { Label } from "@radix-ui/react-label";
import { ImagePlus } from "lucide-react";
import { useRef } from "react";

function ImagePreviews() {
  const { imageSrc, imgUrl, onUpload } = ImgPreview();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">상품 이미지</Label>

      {/* ✅ 클릭 가능한 div로 대체 */}
      <div
        onClick={handleBoxClick}
        className="w-full h-80 cursor-pointer flex gap-5 border overflow-hidden p-4 py-3"
      >
        <p className="mb-auto font-bold text-[14px]">
          대표 이미지
          <span className="text-red-500 pl-2">*</span>
        </p>
        {typeof imageSrc === "string" ? (
          <img
            className="w-60 h-60 object-cover m-auto"
            src={imageSrc}
            alt="프로필 이미지 등록"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 w-60 h-60 object-cover m-auto border-2 border-dashed">
            <ImagePlus size={40} className="text-gray-300" />
            <p className="text-[12px] font-bold text-gray-500">
              이미지를 업로드 해주세요. (드래그 앤 드롭)
            </p>
          </div>
        )}
      </div>

      {/* ✅ 숨겨진 input은 ref로 클릭 */}
      <Input
        id="file"
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={onUpload}
      />
    </div>
  );
}

export default ImagePreviews;
