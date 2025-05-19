"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImgPreview } from "@/hooks/useImagePrevew";
import ImagePreviews from "@/app/(admin)/productRegist/_components/ImagePreview";
import {
  uploadImageToStorage,
  useUpdateProductMutation,
} from "@/lib/queries/admin";
import { useAuthStore } from "@/lib/store/useAuthStore";

type ProductType = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  user_id: string | null;
  created_at: string | null;
  deleted: boolean;
};

export default function EditProductForm({ product }: { product: ProductType }) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [uploading, setUploading] = useState(false);

  const { user } = useAuthStore();

  const { imageSrc, imgUrl, onUpload } = ImgPreview();
  const { mutate } = useUpdateProductMutation(product.id);

  const handleSubmit = async () => {
    if (!user) {
      toast.info("로그인 후 사용해 주세요.");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = imgUrl
        ? await uploadImageToStorage(user?.id, imgUrl)
        : product.image_url;

      mutate({
        id: product.id,
        name,
        description: description || "",
        price: Number(price),
        image_url: imageUrl || "",
        oldImageUrl: product.image_url || "",
      });
    } catch (err) {
      toast.error("수정 실패: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 space-y-5 bg-white rounded-xl">
      <h2 className="text-center text-3xl font-bold">상품 수정</h2>

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
          className="w-full border border-gray-300 mt-2 p-2"
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
          value={description || ""}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full h-40 border border-gray-300 mt-2 p-2"
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
          className="w-full border border-gray-300 mt-2 p-2"
          placeholder="가격"
        />
      </div>

      <ImagePreviews
        editImage={product?.image_url || ""}
        imageSrc={imageSrc || ""}
        onUpload={onUpload}
      />

      <button
        onClick={handleSubmit}
        disabled={uploading}
        className="w-full bg-black text-white py-2 rounded-md disabled:opacity-50 cursor-pointer"
      >
        {uploading ? "수정 중..." : "수정 완료"}
      </button>
    </div>
  );
}
