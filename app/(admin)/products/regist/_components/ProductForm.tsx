"use client";

import { useState } from "react";
import {
  uploadImageToStorage,
  useCreateProductMutation,
} from "@/lib/queries/admin";
import { toast } from "sonner";
import { ImgPreview, useDetailImagePreview } from "@/hooks/useImagePreview";
import ImagePreviews from "./ImagePreview";
import { useAuthStore } from "@/lib/store/useAuthStore";
import DetailImagePreview from "./DetailImagePreview";

function ProductForm() {
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [gender, setGender] = useState("");
  const [color, setColor] = useState("");

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [stockBySize, setStockBySize] = useState<Record<string, number>>({});

  const [uploading, setUploading] = useState(false);

  const { imageSrc, imgUrl, onUpload, onRemove } = ImgPreview();
  const { detailFiles, detailPreviews, detailOnUpload, removeDetailImage } =
    useDetailImagePreview();
  const { user } = useAuthStore();

  const { mutate } = useCreateProductMutation();

  const handleSubmit = async () => {
    if (!name || !description || !imgUrl || !user) {
      toast.info("모든 필수 항목을 입력해 주세요.");
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImageToStorage(user.id, imgUrl);
      const detailImageUrls = await Promise.all(
        detailFiles.map((file) => uploadImageToStorage(user.id, file)),
      );

      mutate({
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
        image_url: imageUrl,
        detailImages: detailImageUrls,
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
          {sizeOptions.map((size) => (
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
        imageSrc={imageSrc || ""}
        onUpload={onUpload}
        onRemove={onRemove}
      />

      <DetailImagePreview
        previews={detailPreviews}
        onUpload={detailOnUpload}
        onRemove={removeDetailImage}
      />

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
