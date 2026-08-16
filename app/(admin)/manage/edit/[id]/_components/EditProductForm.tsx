"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImgPreview, useDetailImagePreview } from "@/hooks/useImagePreview";
import {
  uploadImageToStorage,
  useUpdateProductMutation,
} from "@/lib/queries/admin";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Json } from "@/lib/config/supabase/types_db";
import ImagePreviews from "../../../regist/_components/ImagePreview";
import DetailImagePreview from "../../../regist/_components/DetailImagePreview";

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
  rating_map: Json | null;
  sales_count: number | null;
  views: number | null;
}

export default function EditProductForm({
  product,
}: {
  product: ProductWithImages;
}) {
  const categoryMap: Record<string, string[]> = {
    의류: ["아우터", "상의", "하의", "원피스"],
    신발: ["스니커즈", "구두", "부츠", "샌들"],
    가방: ["백팩", "숄더백", "크로스백", "클러치"],
    액세서리: ["모자", "벨트", "지갑", "기타"],
  };

  const sizeOptionsMap: Record<string, string[]> = {
    의류: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    신발: ["230", "240", "250", "260", "270", "280"],
    가방: [],
    액세서리: [],
  };

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description || "");
  const [price, setPrice] = useState(String(product.price));

  const [tags, setTags] = useState((product.tags || []).join(", "));
  const [category, setCategory] = useState(product.category || "");
  const [subcategory, setSubcategory] = useState(product.subcategory || "");
  const [gender, setGender] = useState(product.gender || "");
  const [color, setColor] = useState(product.color || "");

  const [mainImage, setMainImage] = useState(product.image_url || "");

  const initialStock = (product.stock_by_size as Record<string, number>) || {};
  const hasSizes = category
    ? (sizeOptionsMap[category]?.length || 0) > 0
    : Object.keys(initialStock).length > 0 && !initialStock["FREE"];

  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    hasSizes ? Object.keys(initialStock) : [],
  );
  const [stockBySize, setStockBySize] = useState<Record<string, number>>(
    hasSizes ? initialStock : {},
  );
  const [singleStock, setSingleStock] = useState<number>(
    hasSizes ? 0 : initialStock["FREE"] || product.total_stock || 0,
  );

  const [uploading, setUploading] = useState(false);
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

  const { mutate, isPending } = useUpdateProductMutation(product.id);

  const handleCategoryClick = (newCategory: string) => {
    setCategory(newCategory);
    setSubcategory("");
    setSelectedSizes([]);
    setStockBySize({});
    setSingleStock(0);
  };

  const handleSubmit = async () => {
    if (!name || !description || !user || !category) {
      toast.info("필수 항목 및 카테고리를 모두 입력해 주세요.");
      return;
    }

    const currentHasSizes = sizeOptionsMap[category]?.length > 0;
    const finalStockBySize = currentHasSizes
      ? stockBySize
      : { FREE: singleStock };
    const finalTotalStock = currentHasSizes
      ? Object.values(stockBySize).reduce((sum, val) => sum + val, 0)
      : singleStock;

    try {
      setUploading(true);
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
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        category,
        subcategory,
        gender,
        color,
        stock_by_size: finalStockBySize,
        total_stock: finalTotalStock,
        image_url: newMainImageUrl,
        detail_image_urls: finalDetailImages,
        oldDetailImageIds,
        user_id: product.user_id,
        created_at: product.created_at,
        updated_at: new Date().toISOString(),
        deleted: product.deleted ?? false,
        deleted_at: product.deleted_at ?? null,
        rating_map: product.rating_map ?? null,
        sales_count: product.sales_count ?? 0,
        views: product.views ?? 0,
      });
    } catch (err) {
      toast.error("수정 중 오류가 발생했습니다.");
      console.error(err);
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

  const currentSizeOptions = sizeOptionsMap[category] || [];
  const hasSizeOptions = currentSizeOptions.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* 왼쪽 컬럼: 기본 정보 및 상세 설명 */}
        <div className="flex flex-col h-full gap-6">
          <div className="bg-white p-6 border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">
              기본 정보 수정
            </h3>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600">
                상품 이름
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none"
                placeholder="상품 이름을 입력하세요"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600">
                가격 (원)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none"
                placeholder="가격을 입력하세요"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600 mb-2">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(categoryMap).map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                      category === cat
                        ? "bg-black text-white border-black"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {category && (
              <div className="space-y-1 pt-2 border-t">
                <label className="block text-xs font-semibold text-gray-600 mb-2">
                  하위 카테고리
                </label>
                <div className="flex flex-wrap gap-2">
                  {(categoryMap[category] || []).map((sub) => (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => setSubcategory(sub)}
                      className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                        subcategory === sub
                          ? "bg-black text-white border-black"
                          : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600">
                  성별
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 text-sm bg-white focus:outline-none"
                >
                  <option value="">선택</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-600">
                  색상
                </label>
                <input
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none"
                  placeholder="예: 블랙, 화이트"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-600">
                태그
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none"
                placeholder="쉼표(,)로 구분 (예: 여름, 캐주얼, 신상품)"
              />
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 flex flex-col flex-1 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">
              상세 설명
            </h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full flex-1 border border-gray-300 p-3 text-sm focus:outline-none resize-none h-40"
              placeholder="상품 상세 설명을 입력하세요."
            />
          </div>
        </div>

        {/* 오른쪽 컬럼: 재고 관리 및 이미지 관리 */}
        <div className="flex flex-col h-full gap-6">
          <div className="bg-white p-6 border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">
              {hasSizeOptions ? "옵션 및 재고 관리" : "재고 관리"}
            </h3>

            {!category ? (
              <p className="text-xs text-gray-400 py-4 text-center">
                카테고리를 먼저 선택해 주세요.
              </p>
            ) : hasSizeOptions ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-2">
                    사이즈 선택
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {currentSizeOptions.map((size) => (
                      <button
                        type="button"
                        key={size}
                        onClick={() => handleSizeToggle(size)}
                        className={`px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                          selectedSizes.includes(size)
                            ? "bg-black text-white border-black"
                            : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedSizes.length > 0 && (
                  <div className="space-y-2 pt-2 border-t">
                    <label className="block text-xs font-semibold text-gray-600">
                      선택된 사이즈별 재고 수량
                    </label>
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      {selectedSizes.map((size) => (
                        <div key={size} className="flex items-center gap-3">
                          <span className="w-12 text-[12px] sm:text-sm font-medium text-gray-700">
                            {size}
                          </span>
                          <input
                            type="number"
                            min={0}
                            value={stockBySize[size] || 0}
                            onChange={(e) =>
                              handleStockChange(size, Number(e.target.value))
                            }
                            className="flex-1 border border-gray-300 p-2 text-sm focus:outline-none"
                            placeholder="수량"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t flex justify-between items-center text-sm font-bold text-gray-900">
                  <span>총 재고량</span>
                  <span className="text-green-600">
                    {Object.values(stockBySize).reduce(
                      (sum, val) => sum + val,
                      0,
                    )}{" "}
                    개
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-gray-600">
                  총 재고 수량
                </label>
                <input
                  type="number"
                  min={0}
                  value={singleStock}
                  onChange={(e) => setSingleStock(Number(e.target.value))}
                  className="w-full border border-gray-300 p-2.5 text-sm focus:outline-none"
                  placeholder="재고 수량을 입력하세요"
                />
              </div>
            )}
          </div>

          <div className="bg-white p-6 border border-gray-200 flex flex-col flex-1 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">
              상품 이미지 관리
            </h3>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="block text-xs font-semibold text-gray-600 mb-2">
                  대표 이미지
                </span>
                <ImagePreviews
                  editImage={mainImage}
                  imageSrc={imageSrc || ""}
                  onUpload={handleMainImageUpload}
                  onRemove={handleMainImageRemove}
                />
              </div>

              <div className="pt-2 border-t">
                <span className="block text-xs font-semibold text-gray-600 mb-2">
                  상세 이미지
                </span>
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
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-1/3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3.5 transition-colors cursor-pointer shadow-sm"
        >
          취소
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={uploading || isPending}
          className="w-2/3 bg-black hover:bg-gray-800 text-white font-medium py-3.5 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
        >
          {uploading || isPending ? "상품 수정 중..." : "상품 수정 완료"}
        </button>
      </div>
    </div>
  );
}
