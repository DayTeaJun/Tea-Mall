import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { notFound } from "next/navigation";
import ReviewForm from "./_components/ReviewForm";

export default async function ProductReview({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("deleted", false)
    .single();
  if (!product || error) return notFound();

  return (
    <div className="max-w-2xl mx-auto p-6 my-5 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">상품 품질 리뷰</h2>
      <p className="text-sm text-gray-600 mb-6">
        이 상품의 품질에 만족하셨다면 리뷰를 작성해주세요.
      </p>

      <ReviewForm product={product} />
    </div>
  );
}
