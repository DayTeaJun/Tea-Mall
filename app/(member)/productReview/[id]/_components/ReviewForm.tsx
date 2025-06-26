"use client";

import DetailImagePreview from "@/app/(admin)/products/regist/_components/DetailImagePreview";
import { Button } from "@/components/ui/button";
import { useDetailImagePreview } from "@/hooks/useImagePreview";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { ProductType } from "@/types/product";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

function ReviewForm({ product }: { product: ProductType }) {
  const [ratingValue, setRatingValue] = useState<number>(0);
  const { detailFiles, detailPreviews, detailOnUpload, removeDetailImage } =
    useDetailImagePreview();
  const [reviewText, setReviewText] = useState<string>("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const router = useRouter();

  const handleStarClick = (index: number) => {
    setRatingValue(index + 1);
  };

  const handleSubmit = async () => {
    if (ratingValue === 0) {
      toast.error("별점을 선택해 주세요.");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("리뷰 내용을 입력해 주세요.");
      return;
    }

    const supabase = createBrowserSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user || userError) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const imageUrls: string[] = [];

    for (const file of detailFiles) {
      const filePath = `reviews/${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from(bucket!)
        .upload(filePath, file);

      if (error) {
        toast.error("이미지 업로드 실패");
        return;
      }

      const { data: urlData } = supabase.storage
        .from(bucket!)
        .getPublicUrl(filePath);
      imageUrls.push(urlData.publicUrl);
    }

    // 1. 리뷰 등록
    const { error: insertError } = await supabase.from("reviews").insert([
      {
        user_id: user.id,
        product_id: product.id,
        rating: ratingValue,
        content: reviewText,
        images: imageUrls,
      },
    ]);

    if (insertError) {
      toast.error("리뷰 등록에 실패했습니다.");
      return;
    }

    const { data: productData } = await supabase
      .from("products")
      .select("rating_map")
      .eq("id", product.id)
      .single();

    const currentMap = (productData?.rating_map ?? {}) as Record<
      string,
      number
    >;

    const updatedRatingMap = {
      ...currentMap,
      [user.id]: ratingValue,
    };

    // 3. products 테이블 업데이트
    const { error: updateError } = await supabase
      .from("products")
      .update({ rating_map: updatedRatingMap })
      .eq("id", product.id);

    if (updateError) {
      toast.error("상품 정보 업데이트 실패");
      return;
    }

    toast.success("리뷰가 등록되었습니다.");
    router.push(`/products/${product.id}`);
  };

  return (
    <>
      <div className="flex items-start gap-4 mb-6">
        <Image
          width={80}
          height={80}
          src={product?.image_url || ""}
          alt="상품 이미지"
          className="w-20 h-20 object-cover rounded border"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">{product?.name}</p>
          <div className="flex gap-1 mt-1 items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                onClick={() => handleStarClick(i)}
                onMouseEnter={() => setHoveredStar(i + 1)}
                onMouseLeave={() => setHoveredStar(null)}
                className={`text-[32px] transition-colors duration-200 cursor-pointer ${
                  (hoveredStar ?? ratingValue) > i
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
            <p className="text-gray-400">(* 필수)</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="detail" className="block text-sm font-medium mb-1">
          상세리뷰
        </label>
        <textarea
          id="detail"
          rows={5}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="다른 고객님에게 도움이 되도록 상품에 대한 솔직한 평가를 남겨주세요."
          className="w-full border rounded p-3 text-sm resize-none focus:outline-none focus:ring focus:border-blue-500"
        ></textarea>
        <p className="text-xs text-gray-400 mt-1">
          * 상품과 관련 없는 내용, 광고, 욕설, 성희롱, 저속한 표현 등은 관리자에
          의해 삭제될 수 있습니다.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4">
        <DetailImagePreview
          previews={detailPreviews}
          onUpload={detailOnUpload}
          onRemove={removeDetailImage}
        />
        <p className="text-xs text-gray-400 -mt-4">
          사진은 최대 5장까지 업로드 가능하며, jpg/png/jpeg/gif 포맷을
          지원합니다.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button className="cursor-pointer" variant="outline">
          취소하기
        </Button>
        <Button className="cursor-pointer" type="button" onClick={handleSubmit}>
          등록하기
        </Button>
      </div>
    </>
  );
}

export default ReviewForm;
