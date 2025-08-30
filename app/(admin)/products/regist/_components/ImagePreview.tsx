"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";

interface Props {
  editImage?: string;
  imageSrc: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

function ImagePreviews({ editImage, imageSrc, onUpload, onRemove }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

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

    onUpload(file);
    setIsEdited(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(file);
    setIsEdited(true);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        상품 이미지
      </label>

      <div
        onClick={handleBoxClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        className={`w-full h-80 cursor-pointer flex sm:flex-row flex-col gap-5 border p-4 py-3 mt-2 overflow-hidden transition-all duration-200 ${
          isDragging ? "border-blue-500 border-2 bg-blue-50" : "border-gray-300"
        }`}
      >
        <p className="mb-auto font-bold text-[14px]">
          대표 이미지
          <span className="text-red-500 pl-2">*</span>
        </p>

        {imageSrc || (!isEdited && editImage) ? (
          <div className="relative flex flex-col items-center justify-center gap-2 object-cover m-auto">
            <Image
              width={240}
              height={240}
              className="w-60 h-60 object-cover m-auto"
              src={isEdited ? imageSrc! : editImage!}
              alt="상품 이미지"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
                setIsEdited(false);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer border-gray-700 hover:bg-gray-200"
            >
              <X size={14} className="font-bold" />
            </button>
          </div>
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
        onChange={handleFileChange}
      />
    </div>
  );
}

export default ImagePreviews;
