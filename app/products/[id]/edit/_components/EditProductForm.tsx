"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImgPreview, useDetailImagePreview } from "@/hooks/useImagePreview";
import ImagePreviews from "@/app/(admin)/productRegist/_components/ImagePreview";
import DetailImagePreview from "@/app/(admin)/productRegist/_components/DetailImagePreview";
import {
  uploadImageToStorage,
  useUpdateProductMutation,
} from "@/lib/queries/admin";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

type ProductWithImages = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  user_id: string | null;
  created_at: string | null;
  deleted: boolean;
  product_images?: { id: string; image_url: string }[];
};

export default function EditProductForm({
  product,
}: {
  product: ProductWithImages;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price));
  const [uploading, setUploading] = useState(false);

  const { user } = useAuthStore();
  const router = useRouter();

  const { imageSrc, imgUrl, onUpload } = ImgPreview();
  const { detailFiles, detailPreviews, detailOnUpload, removeDetailImage } =
    useDetailImagePreview();

  const [existingDetailImages, setExistingDetailImages] = useState(
    product.product_images?.map((img) => img.image_url) ?? [],
  );

  const handleRemoveExistingImage = (url: string) => {
    setExistingDetailImages((prev) => prev.filter((item) => item !== url));
  };

  const { mutate } = useUpdateProductMutation(product.id);

  const handleSubmit = async () => {
    if (!name || !description || !user) {
      toast.info("필수 항목을 모두 입력해 주세요.");
      return;
    }

    try {
      setUploading(true);

      const newMainImageUrl = imgUrl
        ? await uploadImageToStorage(user.id, imgUrl)
        : product.image_url;

      const newDetailImageUrls = await Promise.all(
        detailFiles.map((file) => uploadImageToStorage(user.id, file)),
      );

      const mergedDetailImages = [
        ...existingDetailImages,
        ...newDetailImageUrls,
      ];

      mutate({
        id: product.id,
        name,
        description,
        price: Number(price),
        image_url: newMainImageUrl || "",
        oldImageUrl: product.image_url || "",
        detailImages: mergedDetailImages,
      });

      toast.success("상품이 수정되었습니다.");
      router.push("/admin/products");
    } catch (err) {
      toast.error("수정 중 오류가 발생했습니다.");
      console.error(err);
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
          className="w-full h-40 border border-gray-300 mt-2 p-2"
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
        />
      </div>

      <ImagePreviews
        editImage={product.image_url || ""}
        imageSrc={imageSrc || ""}
        onUpload={onUpload}
      />

      <DetailImagePreview
        previews={[...existingDetailImages, ...detailPreviews]}
        onUpload={detailOnUpload}
        onRemove={(index) => {
          if (index < existingDetailImages.length) {
            setExistingDetailImages((prev) =>
              prev.filter((_, i) => i !== index),
            );
          } else {
            const adjustedIndex = index - existingDetailImages.length;
            removeDetailImage(adjustedIndex);
          }
        }}
      />

      <div className="flex gap-2 justify-between">
        <button
          onClick={() => router.back()}
          className="w-1/3 bg-red-400 text-white py-2 rounded-md"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-2/3 bg-black text-white py-2 rounded-md disabled:opacity-50"
        >
          {uploading ? "수정 중..." : "수정 완료"}
        </button>
      </div>
    </div>
  );
}
