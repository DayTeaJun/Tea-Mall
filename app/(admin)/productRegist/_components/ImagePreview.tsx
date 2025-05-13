"use client";

import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface Props {
  imageSrc: string | null;
  onUpload: (file: File) => Promise<void>;
}

function ImagePreviews({ imageSrc, onUpload }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleBoxClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) {
      toast.error("파일이 없습니다.");
      return;
    }

    onUpload(file); // ✅ 여기서는 절대 undefined 아님
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = () => {
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        상품 이미지
      </label>

      <div
        onClick={handleBoxClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`w-full h-80 cursor-pointer flex gap-5 border p-4 py-3 mt-2 overflow-hidden transition-all duration-200 ${
          isDragging ? "border-blue-500 border-2 bg-blue-50" : "border-gray-300"
        }`}
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

      <input
        id="file"
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file); // ✅ 여기서 File만 전달
        }}
      />
    </div>
  );
}

export default ImagePreviews;
