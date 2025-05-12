"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDeleteProductMutation } from "@/lib/queries/admin";

export default function ProductDelBtn({
  productId,
  imageUrl,
}: {
  productId: string;
  imageUrl: string;
}) {
  const { mutate } = useDeleteProductMutation(productId);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 상품을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      mutate(imageUrl);
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error ? err.message : "삭제 중 오류가 발생했습니다.",
      );
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="absolute right-4 top-4 cursor-pointer"
    >
      상품 삭제
    </Button>
  );
}
