"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { ProductType } from "@/types/product";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import DetailImagePreview from "@/app/(admin)/products/regist/_components/DetailImagePreview";
import { useDetailImagePreview } from "@/hooks/useImagePreview";

function ReviewEditForm({
  product,
  userId,
}: {
  product: ProductType;
  userId: string;
}) {
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  // 새로 추가하는 이미지(파일) & 미리보기
  const { detailFiles, detailPreviews, detailOnUpload, removeDetailImage } =
    useDetailImagePreview();

  // 화면에서 유지하기로 선택된 기존 이미지(public URL)
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // 최초 로드된 원본 이미지(public URL) — 상품수정의 oldDetailImageIds와 유사한 스냅샷 역할
  const [originalImages, setOriginalImages] = useState<string[]>([]);

  const router = useRouter();
  const supabase = createBrowserSupabaseClient();
  const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET!;

  // public URL → storage 경로로 변환
  const publicUrlToPath = (url: string) => {
    const marker = `/object/public/${BUCKET}/`;
    const idx = url.indexOf(marker);
    if (idx === -1) return "";
    return url.substring(idx + marker.length);
  };

  useEffect(() => {
    const fetchReview = async () => {
      const { data: review, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", product.id)
        .single();

      if (error || !review) {
        toast.error(
          "리뷰 정보를 불러오지 못했습니다. 관리자에게 문의해주세요.",
        );
        return;
      }

      setRatingValue(review.rating);
      setReviewText(review.content);

      const imgs: string[] = Array.isArray(review.images) ? review.images : [];
      setExistingImages(imgs);
      setOriginalImages(imgs); // 스냅샷 확정 (이후 절대 변경하지 않음)
    };

    fetchReview();
  }, [product.id, userId]);

  const handleStarClick = (index: number) => setRatingValue(index + 1);

  const handleUpdate = async () => {
    if (!reviewText.trim() || ratingValue === 0) {
      toast.error("별점과 내용을 모두 입력해주세요.");
      return;
    }

    // 1) 새 파일 업로드
    const uploadedUrls: string[] = [];
    for (const file of detailFiles) {
      const filePath = `reviews/${userId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file);
      if (uploadError) {
        toast.error("이미지 업로드 실패");
        return;
      }
      const { data: urlData } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filePath);
      uploadedUrls.push(urlData.publicUrl);
    }

    // 2) 삭제 대상 계산: 원본 - 현재 유지 중인 기존 이미지
    const removed = originalImages.filter((u) => !existingImages.includes(u));

    // 3) 스토리지에서 제거 (실패하더라도 저장 자체는 진행)
    if (removed.length > 0) {
      const deletePaths = removed
        .map(publicUrlToPath)
        .filter((p) => typeof p === "string" && p.length > 0);
      if (deletePaths.length > 0) {
        await supabase.storage.from(BUCKET).remove(deletePaths);
      }
    }

    // 4) DB 반영: "남겨둔 기존 + 새 업로드"
    //    detailPreviews는 UI 전용이므로 DB에 절대 넣지 않음
    const nextImages = [...existingImages, ...uploadedUrls];

    const { error: updateError } = await supabase
      .from("reviews")
      .update({
        rating: ratingValue,
        content: reviewText,
        images: nextImages,
      })
      .eq("user_id", userId)
      .eq("product_id", product.id);

    if (updateError) {
      toast.error("리뷰 수정 실패");
      return;
    }

    toast.success("리뷰가 수정되었습니다.");
    router.push(`/products/${product.id}`);
  };

  return (
    <div>
      <div className="flex gap-4 mb-4 items-start">
        <Image
          src={product.image_url || ""}
          alt={product.name}
          width={80}
          height={80}
          className="rounded border w-20 h-20"
        />
        <div>
          <p className="text-sm font-medium">{product.name}</p>
          <div className="flex gap-1 items-center mt-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                onClick={() => handleStarClick(i)}
                onMouseEnter={() => setHoveredStar(i + 1)}
                onMouseLeave={() => setHoveredStar(null)}
                className={`text-[32px] cursor-pointer ${
                  (hoveredStar ?? ratingValue) > i
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      <textarea
        rows={5}
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        className="w-full border p-3 text-sm rounded mb-4"
        placeholder="수정할 리뷰 내용을 입력해주세요."
      />

      {/* 화면 표시용으로만 기존 + 새 미리보기 합쳐서 전달 */}
      <DetailImagePreview
        previews={[...existingImages, ...detailPreviews]}
        onUpload={detailOnUpload}
        onRemove={(index) => {
          if (index < existingImages.length) {
            // 기존 이미지 제거 → existingImages에서만 제외 (스토리지 삭제는 저장 시 일괄)
            setExistingImages((prev) => prev.filter((_, i) => i !== index));
          } else {
            // 새 이미지 제거
            removeDetailImage(index - existingImages.length);
          }
        }}
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={() => router.back()}>
          취소
        </Button>
        <Button onClick={handleUpdate}>수정하기</Button>
      </div>
    </div>
  );
}

export default ReviewEditForm;
