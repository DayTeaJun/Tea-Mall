import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageOff } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerSupabaseClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product || error) return notFound();

  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{product.name}</CardTitle>
          <Badge variant="secondary" className="mt-2 text-sm">
            {product.created_at?.slice(0, 10)}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full md:w-1/2 aspect-square bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="object-cover"
              />
            ) : (
              <ImageOff className="text-gray-400 w-12 h-12" />
            )}
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
    </main>
  );
}
