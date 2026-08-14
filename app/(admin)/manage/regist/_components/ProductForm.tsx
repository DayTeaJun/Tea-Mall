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
  const [singleStock, setSingleStock] = useState<number>(0);

  const [uploading, setUploading] = useState(false);

  const { imageSrc, imgUrl, onUpload, onRemove } = ImgPreview();
  const { detailFiles, detailPreviews, detailOnUpload, removeDetailImage } =
    useDetailImagePreview();
  const { user } = useAuthStore();

  const { mutate } = useCreateProductMutation();

  const handleCategoryClick = (newCategory: string) => {
    setCategory(newCategory);
    setSubcategory("");
    setSelectedSizes([]);
    setStockBySize({});
    setSingleStock(0);
  };

  const handleSubmit = async () => {
    if (!name || !description || !imgUrl || !user || !category) {
      toast.info("필수 항목 및 카테고리를 모두 입력해 주세요.");
      return;
    }

    const hasSizes = sizeOptionsMap[category]?.length > 0;
    const finalStockBySize = hasSizes ? stockBySize : { FREE: singleStock };
    const finalTotalStock = hasSizes
      ? Object.values(stockBySize).reduce((sum, val) => sum + val, 0)
      : singleStock;

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
        stock_by_size: finalStockBySize,
        total_stock: finalTotalStock,
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

  const currentSizeOptions = sizeOptionsMap[category] || [];
  const hasSizeOptions = currentSizeOptions.length > 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col h-full gap-6">
          <div className="bg-white p-6 border border-gray-200 space-y-4">
            <h3 className="font-semibold text-gray-800 border-b pb-2">
              기본 정보
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
                  {categoryMap[category].map((sub) => (
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
              className="w-full flex-1 border border-gray-300 p-3 text-sm focus:outline-none resize-none"
              placeholder="상품 상세 설명을 입력하세요."
            />
          </div>
        </div>

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
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {selectedSizes.map((size) => (
                        <div key={size} className="flex items-center gap-3">
                          <span className="w-12 text-sm font-medium text-gray-700">
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
              상품 이미지
            </h3>

            <div className="space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="block text-xs font-semibold text-gray-600 mb-2">
                  대표 이미지
                </span>
                <ImagePreviews
                  imageSrc={imageSrc || ""}
                  onUpload={onUpload}
                  onRemove={onRemove}
                />
              </div>

              <div className="pt-2 border-t">
                <span className="block text-xs font-semibold text-gray-600 mb-2">
                  상세 이미지
                </span>
                <DetailImagePreview
                  previews={detailPreviews}
                  onUpload={detailOnUpload}
                  onRemove={removeDetailImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3.5 transition-colors disabled:opacity-50 cursor-pointer shadow-md"
        >
          {uploading ? "상품 등록 중..." : "상품 등록 완료"}
        </button>
      </div>
    </div>
  );
}

export default ProductForm;
