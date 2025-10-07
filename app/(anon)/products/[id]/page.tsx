import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/config/supabase/server/server";
import ProductImageSection from "./_components/ProductImageSection";
import ShareButton from "@/components/common/buttons/ShareBtn";
import ProductPurchaseSection from "./_components/ProductPurchaseSection";
import RecommendProductsCarousel from "./_components/RecommendProductsCarousel";
import CommentsSection from "./_components/CommentsSection";
import { publicSupabase } from "@/lib/config/supabase/publicClient";
import Image from "next/image";

// 메타 태그 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const id = (await params).id;
  const { data: product } = await publicSupabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("deleted", false)
    .single();

  if (!product) {
    return {
      title: "상품을 찾을 수 없습니다",
      description: "존재하지 않거나 삭제된 상품입니다.",
    };
  }

  return {
    title: `T-Mall | ${product.name}`,
    description: product.description?.slice(0, 100) || "상품 상세 정보",
    openGraph: {
      title: `T-Mall | ${product.name}`,
      description: product.description?.slice(0, 100) || "상품 상세 정보",
      images: product.image_url
        ? [
            {
              url: product.image_url,
              width: 800,
              height: 600,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `T-Mall | ${product.name}`,
      description: product.description?.slice(0, 100) || "상품 상세 정보",
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

// 정적 경로 생성 SSG
export async function generateStaticParams() {
  const { data: products } = await publicSupabase
    .from("products")
    .select("id")
    .eq("deleted", false);

  return (
    products?.map((product) => ({
      id: product.id,
    })) ?? []
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const id = (await params).id;

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("deleted", false)
    .single();
  if (!product || error) return notFound();

  const { data: detailImages } = await supabase
    .from("product_images")
    .select("image_url, sort_order")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  const formattedPrice = product.price.toLocaleString();

  const isSoldOut =
    product.total_stock === 0 ||
    product.total_stock === null ||
    product.total_stock === undefined;

  return (
    <main className="max-w-7xl mt-12 mx-auto p-4 sm:p-8 sm:py-12 flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <div className="col-span-1">
          <ProductImageSection
            mainImage={product.image_url ?? ""}
            detailImages={detailImages ?? []}
          />
        </div>

        <div className="col-span-1 lg:col-span-2 flex flex-col justify-between w-full">
          <div>
            <p className="text-sm text-gray-500 mb-1">티몰 공식 판매처</p>

            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                {isSoldOut && (
                  <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-700">
                    Sold out
                  </span>
                )}
              </div>
              <ShareButton />
            </div>

            <div className="text-sm text-gray-600 mb-2 space-x-2">
              {product.category && <span>카테고리: {product.category}</span>}
              {product.subcategory && (
                <span>· 서브카테고리: {product.subcategory}</span>
              )}
              {product.gender && <span>· 성별: {product.gender}</span>}
              {product.color && <span>· 색상: {product.color}</span>}
            </div>

            <hr className="my-2" />

            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-green-700">
                {formattedPrice}원
              </div>

              <p className="text-sm text-gray-500">
                배송비 3,000원 (20,000원 이상 구매 시 무료)
              </p>

              {isSoldOut ? (
                <p className="text-sm font-semibold text-red-600">
                  현재 재고가 없습니다 (Sold out)
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  총 재고: {product.total_stock}개
                </p>
              )}
            </div>

            <hr className="my-2" />

            <p className="text-gray-700 mb-4 whitespace-pre-line overflow-hidden text-ellipsis line-clamp-5">
              {product.description}
            </p>

            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <hr className="my-4" />

          {isSoldOut ? (
            <div className="p-4 border rounded bg-gray-50 text-sm text-gray-600">
              이 상품은 현재 품절되었습니다. 재입고 시 알림받기를 이용해 주세요.
            </div>
          ) : (
            <ProductPurchaseSection
              productId={product.id}
              stockBySize={product.stock_by_size as Record<string, number>}
            />
          )}
        </div>
      </div>

      <div className="mt-10">
        {detailImages &&
          detailImages.map((image) => (
            <div key={image.sort_order} className="mb-4 w-full">
              <Image
                width={1200}
                height={1800}
                src={image.image_url}
                alt={`Product detail ${image.sort_order}`}
                className="w-full h-auto"
              />
            </div>
          ))}
      </div>

      <CommentsSection productId={id} />

      <RecommendProductsCarousel />
    </main>
  );
}
