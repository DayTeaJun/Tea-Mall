import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageOff } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import ProductDelBtn from "./_components/ProductDelBtn";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();

  // nextjs 15 params가 비동기적으로 작동하도록 권장
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("deleted", false)
    .single();

  if (!product || error) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-12 px-4 relative">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{product.name}</CardTitle>
          <Badge variant="secondary" className="mt-2 text-sm">
            {product.created_at?.slice(0, 10)}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-1/2 aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
            <div className="relative w-full md:w-1/2 aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <ImageOff className="text-gray-400 w-12 h-12" />
              )}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <p className="text-gray-700 whitespace-pre-line">
              {product.description}
            </p>
            <p className="text-xl font-bold text-right">
              {product.price.toLocaleString()}원
            </p>
          </div>
        </CardContent>
      </Card>

      {product.image_url && (
        <ProductDelBtn productId={product.id} imageUrl={product.image_url} />
      )}
    </main>
  );
}
