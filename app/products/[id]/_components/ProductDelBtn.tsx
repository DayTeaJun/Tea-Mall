"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteProduct } from "@/lib/actions/admin";

export default function ProductDelBtn({
  productId,
  imageUrl,
}: {
  productId: string;
  imageUrl: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 이 상품을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteProduct(productId, imageUrl);
      toast.success("상품이 삭제되었습니다.");
      router.push("/"); // 목록 페이지 등으로 리다이렉트
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
