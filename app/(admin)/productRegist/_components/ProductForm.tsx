"use client";

import { useState } from "react";
import {
  uploadImageToStorage,
  useCreateProductMutation,
} from "@/lib/queries/admin";
import { toast } from "sonner";
import { ImgPreview } from "@/hooks/useImagePrevew";
import ImagePreviews from "./ImagePreview";

function ProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const { imageSrc, imgUrl, onUpload } = ImgPreview();

  const { mutate } = useCreateProductMutation();

  const handleSubmit = async () => {
    if (!imgUrl) {
      toast.info("이미지를 선택해 주세요.");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToStorage(imgUrl);

      mutate({
        name,
        description,
        price: Number(price),
        image_url: imageUrl,
      });
    } catch (err) {
      if (err instanceof Error) {
        console.error("상품 등록 실패:", err.message);
        toast.error("등록 중 오류: " + err.message);
      } else {
        console.error("상품 등록 실패:", err);
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          상품 이름
        </label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-none mt-2 p-2"
          placeholder="상품 이름"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          상품 설명
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-40 border border-gray-300 rounded-none mt-2 p-2"
          placeholder="상품 설명"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          가격
        </label>
        <input
          id="price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-none mt-2 p-2"
          placeholder="가격"
        />
      </div>

      <ImagePreviews imageSrc={imageSrc || ""} onUpload={onUpload} />

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50 cursor-pointer"
      >
        {uploading ? "업로드 중..." : "상품 등록"}
      </button>
    </>
  );
}

export default ProductForm;
