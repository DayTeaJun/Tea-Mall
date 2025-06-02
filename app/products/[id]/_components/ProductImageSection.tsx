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

  return (
    <div className="flex gap-4">
      {hasImages && (
        <div className="flex flex-col gap-2 overflow-x-auto shrink-0 scrollbar-gutter-stable pb-2">
          {imageList.map((img, index) => (
            <img
              key={index}
              src={img}
              onClick={() => setCurrentImage(img)}
              className={`w-[70px] h-[70px] object-cover cursor-pointer border shrink-0 ${
                currentImage === img ? "border-blue-300" : ""
              }`}
              alt={`상세 이미지 ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="flex items-start justify-center w-[50%] h-[400px] flex-1">
        {hasImages ? (
          <img
            src={currentImage}
            alt="대표 이미지"
            className="object-cover w-full h-full"
          />
        ) : (
          <ImageOff className="w-20 h-20 text-gray-400" />
        )}
      </div>
    </div>
  );
}
