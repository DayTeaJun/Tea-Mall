"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { toast } from "sonner"; // 💡 알림 처리를 위해 추가

interface Props {
  previews: string[];
  onUpload: (files: FileList | null) => void;
  onRemove: (index: number) => void;
}

export default function DetailImagePreview({
  previews,
  onUpload,
  onRemove,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    if (previews.length >= 5) {
      toast.warning("이미지는 최대 5개까지만 첨부할 수 있습니다.");
      return;
    }
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex gap-2 items-center">
        첨부 이미지
        <span className="text-xs text-gray-400">
          (* 최대 5개까지 업로드 가능합니다.)
        </span>
      </label>

      <div className="w-full border border-gray-300 p-4 overflow-x-auto rounded-sm bg-white">
        <div className="flex gap-4 w-fit">
          {previews.slice(0, 5).map((src, idx) => (
            <div
              key={idx}
              className="relative w-24 h-24 sm:w-32 sm:h-32 border flex-shrink-0 overflow-hidden rounded-md group bg-gray-50"
            >
              <Image
                width={128}
                height={128}
                src={src}
                alt={`문의 첨부 이미지 ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(idx);
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md cursor-pointer border-gray-700 hover:bg-gray-200 transition-colors"
              >
                <X size={14} className="font-bold" />
              </button>

              {idx === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5 font-medium">
                  대표
                </span>
              )}
            </div>
          ))}

          {previews.length < 5 && (
            <div
              onClick={handleClick}
              className="w-24 h-24 sm:w-32 sm:h-32 border-2 border-dashed flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer flex-shrink-0 gap-2 rounded-md transition-colors"
            >
              <ImagePlus size={28} className="text-gray-300" />
              <p className="text-[12px] font-bold text-gray-500">이미지 추가</p>
            </div>
          )}
        </div>
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            if (previews.length + files.length > 5) {
              toast.warning("이미지는 최대 5개까지만 첨부할 수 있습니다.");
              e.target.value = "";
              return;
            }
          }
          onUpload(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
