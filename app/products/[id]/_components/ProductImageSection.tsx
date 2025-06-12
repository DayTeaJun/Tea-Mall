"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";

interface ImageItem {
  image_url: string;
  sort_order: number | null;
}

interface Props {
  mainImage: string;
  detailImages?: ImageItem[];
}

export default function ProductImageSection({
  mainImage,
  detailImages = [],
}: Props) {
  const [currentImage, setCurrentImage] = useState(mainImage);

  const imageList = [mainImage, ...detailImages.map((i) => i.image_url)].filter(
    (v, i, arr) => arr.indexOf(v) === i && v,
  );

  const hasImages = imageList.length > 0;

  console.log("imageList", imageList);

  return (
    <div className="flex gap-4">
      {hasImages && (
        <div className="flex flex-col gap-2 overflow-x-auto shrink-0 scrollbar-gutter-stable pb-2">
          {imageList.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => setCurrentImage(img)}
              className={`w-[70px] h-[70px] object-cover cursor-pointer border-2 shrink-0 ${
                currentImage === img ? "border-blue-400" : ""
              }`}
              alt={`상세 이미지 ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-start justify-center w-[50%] h-[400px] flex-1">
        {hasImages ? (
          currentImage ? (
            <img
              src={currentImage}
              alt="대표 이미지"
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex flex-col gap-2 items-center justify-center w-full h-[400px] bg-gray-100 ">
              <ImageOff size={40} className="text-gray-400" />
              <p className="text-gray-500">대표 이미지가 없습니다.</p>
            </div>
          )
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center w-full h-[400px] bg-gray-100 ">
            <ImageOff size={40} className="text-gray-400" />
            <p className="text-gray-500">이미지가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
