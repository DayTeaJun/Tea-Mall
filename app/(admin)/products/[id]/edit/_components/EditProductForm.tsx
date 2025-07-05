"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImgPreview, useDetailImagePreview } from "@/hooks/useImagePreview";
import ImagePreviews from "@/app/(admin)/products/regist/_components/ImagePreview";
import DetailImagePreview from "@/app/(admin)/products/regist/_components/DetailImagePreview";
import {
  uploadImageToStorage,
  useUpdateProductMutation,
} from "@/lib/queries/admin";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Json } from "@/lib/config/supabase/types_db";

interface ProductWithImages {
  category: string | null;
  color: string | null;
  created_at: string | null;
  deleted: boolean;
  deleted_at: string | null;
  description: string | null;
  gender: string | null;
  id: string;
  image_url: string | null;
  name: string;
  price: number;
  stock_by_size: Json | null;
  subcategory: string | null;
  tags: string[] | null;
  total_stock: number | null;
  updated_at: string | null;
  user_id: string | null;
  product_images: {
    id: string;
    image_url: string;
  }[];
}

export default function EditProductForm({
  product,
}: {
  product: ProductWithImages;
}) {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price));

  const [tags, setTags] = useState((product.tags || []).join(", "));
  const [category, setCategory] = useState(product.category || "");
  const [subcategory, setSubcategory] = useState(product.subcategory || "");
  const [gender, setGender] = useState(product.gender || "");
  const [color, setColor] = useState(product.color || "");

  const [mainImage, setMainImage] = useState(product.image_url || "");

  const [selectedSizes, setSelectedSizes] = useState(
    Object.keys(product.stock_by_size || {}),
  );
  const [stockBySize, setStockBySize] = useState<Record<string, number>>(
    (product.stock_by_size as Record<string, number>) || {},
  );
  const { user } = useAuthStore();
  const router = useRouter();

  const {
    imageSrc,
    imgUrl,
    onUpload: rawUpload,
    onRemove: rawRemove,
  } = ImgPreview();

  const handleMainImageUpload = (file: File) => {
    rawUpload(file);
    setMainImage("");
  };

  const handleMainImageRemove = () => {
    rawRemove();
    setMainImage("");
  };

  const { detailFiles, detailPreviews, detailOnUpload, removeDetailImage } =
    useDetailImagePreview();

  const [existingDetailImages, setExistingDetailImages] = useState(
    product.product_images?.map((img) => ({
      id: img.id,
      url: img.image_url,
    })) ?? [],
  );

  const { mutate, isPending, isSuccess } = useUpdateProductMutation(product.id);

  const handleSubmit = async () => {
    if (!name || !description || !user) {
      toast.info("필수 항목을 모두 입력해 주세요.");
      return;
    }

    try {
      const newMainImageUrl = imgUrl
        ? await uploadImageToStorage(user.id, imgUrl)
        : mainImage || null;

      const newDetailImageUrls = await Promise.all(
        detailFiles.map((file) => uploadImageToStorage(user.id, file)),
      );

      const finalDetailImages = [
        ...existingDetailImages.map((img) => img.url),
        ...newDetailImageUrls,
      ];

      const oldDetailImageIds = existingDetailImages.map((img) => img.id);

      mutate({
        id: product.id,
        name,
        description,
        price: Number(price),
        tags: tags.split(",").map((tag) => tag.trim()),
        category,
        subcategory,
        gender,
        color,
        stock_by_size: stockBySize,
        total_stock: Object.values(stockBySize).reduce(
          (sum, val) => sum + val,
          0,
        ),
        image_url: newMainImageUrl,
        detail_image_urls: finalDetailImages,
        oldDetailImageIds,
        user_id: product.user_id,
        created_at: product.created_at,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      toast.error("수정 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
      const newStock = { ...stockBySize };
      delete newStock[size];
      setStockBySize(newStock);
    } else {
      setSelectedSizes([...selectedSizes, size]);
      setStockBySize({ ...stockBySize, [size]: 0 });
    }
  };

  const handleStockChange = (size: string, value: number) => {
    setStockBySize({ ...stockBySize, [size]: value });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-5 bg-white rounded-xl">
      <h2 className="text-center text-xl font-bold mb-4">상품 수정</h2>

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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          태그 (쉼표로 구분)
        </label>
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full border border-gray-300 rounded-none mt-2 p-2"
          placeholder="예: 여름, 남성용, 캐주얼"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border border-gray-300 rounded-none mt-2 p-2"
        >
          <option value="">선택</option>
          <option value="상의">상의</option>
          <option value="하의">하의</option>
          <option value="아우터">아우터</option>
          <option value="신발">신발</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          하위 카테고리
        </label>
        <input
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          className="w-full border border-gray-300 rounded-none mt-2 p-2"
          placeholder="하위 카테고리 입력"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">성별</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full border border-gray-300 rounded-none mt-2 p-2"
        >
          <option value="">선택</option>
          <option value="남성">남성</option>
          <option value="여성">여성</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">색상</label>
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-full border border-gray-300 rounded-none mt-2 p-2"
          placeholder="색상 입력"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          사이즈 및 재고
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {["XS", "S", "M", "L", "XL", "XXL", "XXXL", "기타"].map((size) => (
            <label key={size} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={() => handleSizeToggle(size)}
              />
              <span>{size}</span>
            </label>
          ))}
        </div>

        {selectedSizes.map((size) => (
          <div key={size} className="flex items-center space-x-2 mb-1">
            <span className="w-12">{size}</span>
            <input
              type="number"
              min={0}
              value={stockBySize[size] || 0}
              onChange={(e) => handleStockChange(size, Number(e.target.value))}
              className="flex-1 border border-gray-300 rounded-none p-2"
              placeholder="재고 수량"
            />
          </div>
        ))}

        <div className="mt-2 text-sm text-gray-700 font-semibold">
          총 재고량:{" "}
          {Object.values(stockBySize).reduce((sum, val) => sum + val, 0)}
        </div>
      </div>

      <ImagePreviews
        editImage={mainImage}
        imageSrc={imageSrc || ""}
        onUpload={handleMainImageUpload}
        onRemove={handleMainImageRemove}
      />

      <DetailImagePreview
        previews={[
          ...existingDetailImages.map((img) => img.url),
          ...detailPreviews,
        ]}
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
          className="w-1/3 bg-red-400 text-white py-2 rounded-md cursor-pointer"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending || isSuccess}
          className="w-2/3 bg-black text-white py-2 rounded-md disabled:opacity-50 cursor-pointer"
        >
          {isPending ? "수정 중..." : "수정"}
        </button>
      </div>
    </div>
  );
}
