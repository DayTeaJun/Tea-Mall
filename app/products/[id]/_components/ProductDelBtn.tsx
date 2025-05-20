"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDeleteProductMutation } from "@/lib/queries/admin";

export default function ProductDelBtn({
  productId,
  imageUrl,
  isOwner,
}: {
  productUserId: string | null;
  productId: string;
  imageUrl: string;
  isOwner: boolean;
}) {
  const { mutate } = useDeleteProductMutation(productId);

  const handleDelete = async () => {
    if (!isOwner) {
      toast.error("해당 상품을 등록한 사용자만 삭제할 수 있습니다.");
      return;
    }

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
    <Button onClick={handleDelete} className="cursor-pointer">
      상품 삭제
    </Button>
  );
}
