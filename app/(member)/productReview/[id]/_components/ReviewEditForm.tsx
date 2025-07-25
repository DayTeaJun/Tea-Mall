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

function ReviewEditForm({ product }: { product: ProductType }) {
  const [ratingValue, setRatingValue] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const { detailFiles, detailPreviews, detailOnUpload, removeDetailImage } =
    useDetailImagePreview();
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const router = useRouter();

  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchReview = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        toast.error("로그인이 필요합니다.");
        return;
      }

      const { data: review, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", product.id)
        .single();

      if (error || !review) {
        toast.error("리뷰 정보를 불러오지 못했습니다.");
        return;
      }

      setRatingValue(review.rating);
      setReviewText(review.content);
      if (review.images?.length) {
        setExistingImages(review.images);
      }
    };

    fetchReview();
  }, [product.id]);

  const handleStarClick = (index: number) => setRatingValue(index + 1);

  const handleUpdate = async () => {
    if (!reviewText.trim() || ratingValue === 0) {
      toast.error("별점과 내용을 모두 입력해주세요.");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }

    const uploadedUrls: string[] = [];

    for (const file of detailFiles) {
      const filePath = `reviews/${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .upload(filePath, file);

      if (error) {
        toast.error("이미지 업로드 실패");
        return;
      }

      const { data: urlData } = supabase.storage
        .from(process.env.NEXT_PUBLIC_STORAGE_BUCKET!)
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
    }

    const { error } = await supabase
      .from("reviews")
      .update({
        rating: ratingValue,
        content: reviewText,
        images:
          uploadedUrls.length > 0
            ? [...existingImages, ...uploadedUrls]
            : [...existingImages, ...detailPreviews],
      })
      .eq("user_id", user.id)
      .eq("product_id", product.id);

    if (error) {
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
      ></textarea>

      <DetailImagePreview
        previews={[...existingImages, ...detailPreviews]}
        onUpload={detailOnUpload}
        onRemove={(index) => {
          if (index < existingImages.length) {
            setExistingImages((prev) => prev.filter((_, i) => i !== index));
          } else {
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
