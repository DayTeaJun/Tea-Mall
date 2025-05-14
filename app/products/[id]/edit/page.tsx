// app/products/[id]/edit/page.tsx
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import EditProductForm from "./_components/EditProductForm";

export default async function EditProductPage({
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

  if (!product || error) {
    return <div>상품 정보를 불러오지 못했습니다.</div>;
  }

  return <EditProductForm product={product} />;
}
