"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { useParams } from "next/navigation";
import { Database } from "@/lib/config/supabase/types_db";

type Product = Database["public"]["Tables"]["products"]["Row"];

export default function ProductReview() {
  const { productId } = useParams();
  const [imageCount, setImageCount] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);

  const id = productId as string;

  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createBrowserSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn("로그인된 유저가 아닙니다.");
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("deleted", false)
        .single();

      if (!error && data) setProduct(data);
    };

    if (productId) fetchProduct();
  }, [productId]);

  console.log(product);

  return (
    <div className="max-w-2xl mx-auto p-6 my-5 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">상품 품질 리뷰</h2>
      <p className="text-sm text-gray-600 mb-6">
        이 상품의 품질에 만족하셨다면 리뷰를 작성해주세요.
      </p>

      <div className="flex items-start gap-4 mb-6">
        <img
          src={product?.image_url}
          alt="상품 이미지"
          className="w-20 h-20 object-cover rounded border"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">{product?.name}</p>
          <div className="flex gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-gray-400 text-lg">
                ★
              </span>
            ))}
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
          placeholder="다른 고객님에게 도움이 되도록 상품에 대한 솔직한 평가를 남겨주세요."
          className="w-full border rounded p-3 text-sm resize-none focus:outline-none focus:ring focus:border-blue-500"
        ></textarea>
        <p className="text-xs text-gray-400 mt-1">
          * 상품과 관련 없는 내용, 광고, 욕설, 성희롱, 저속한 표현 등은 관리자에
          의해 삭제될 수 있습니다.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">사용자 사진</label>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setImageCount((prev) => (prev < 5 ? prev + 1 : prev))
            }
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            사진 업로드하기
          </Button>
          <p className="text-sm text-gray-600">{imageCount} / 5</p>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          사진은 최대 5장까지 업로드 가능하며, jpg/png/jpeg/gif 포맷을
          지원합니다.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">취소하기</Button>
        <Button type="submit">등록하기</Button>
      </div>
    </div>
  );
}
