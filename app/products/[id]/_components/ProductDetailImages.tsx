import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import { ImageOff } from "lucide-react";

type Props = {
  productId: string;
};

export default async function ProductDetailImages({ productId }: Props) {
  const supabase = await createServerSupabaseClient();

  const { data: images, error } = await supabase
    .from("product_images")
    .select("image_url, sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: true });

  if (!images || images.length === 0 || error) {
    return (
      <div className="mt-10 text-center text-gray-400 flex flex-col items-center gap-2">
        <ImageOff className="w-10 h-10" />
        <p className="text-sm">등록된 상세 이미지가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="my-5">
      <h2 className="text-xl font-semibold mb-4">상세 이미지</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-gutter-stable pb-4">
        {images.map((img, index) => (
          <img
            key={index}
            src={img.image_url}
            alt={`상세 이미지 ${index + 1}`}
            className="w-20 h-auto object-cover border rounded shrink-0"
          />
        ))}
      </div>
    </div>
  );
}
