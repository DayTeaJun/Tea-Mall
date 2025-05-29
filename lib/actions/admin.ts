"use server";

import { CreateProductType, ProductUpdateType } from "@/types/product";
import { createServerSupabaseClient } from "../config/supabase/server/server";
import { extractFilePathFromUrl } from "../utils/supabaseStorageUtils";

export async function createProduct({
  name,
  description,
  price,
  image_url,
  detailImages,
}: CreateProductType) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return alert("로그인 후 사용해주세요.");
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert([
      {
        name,
        description,
        price,
        image_url,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (productError) {
    throw new Error("상품 등록 실패", productError);
  }

  const imageRecords = detailImages.slice(0, 5).map((url, index) => ({
    product_id: product.id,
    image_url: url,
    sort_order: index,
  }));

  const { error: detailError } = await supabase
    .from("product_images")
    .insert(imageRecords);

  if (detailError) {
    console.error("상세 이미지 등록 실패:", detailError.message);
    throw new Error(detailError.message);
  }

  return product;
}

export async function deleteProduct({
  productId,
  imagePath,
}: {
  productId: string;
  imagePath: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { error: imageDeleteError } = await supabase.storage
    .from("product-images")
    .remove([imagePath]);

  if (imageDeleteError) {
    throw new Error("이미지 삭제 실패: " + imageDeleteError.message);
  }

  const { error: productDeleteError } = await supabase
    .from("products")
    .update({
      deleted: true,
      deleted_at: new Date().toISOString(), // 삭제 시간 기록
    })
    .eq("id", productId);

  if (productDeleteError) {
    throw new Error("상품 삭제 실패: " + productDeleteError.message);
  }
}

export async function updateProduct({
  id,
  name,
  description,
  price,
  image_url,
  oldImageUrl,
  oldDetailImageIds = [],
  detail_image_urls = [],
}: ProductUpdateType) {
  const supabase = await createServerSupabaseClient();
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) throw new Error("로그인 후 사용해주세요.");
  if (!id) throw new Error("잘못된 접근입니다.");

  const { data: foundProduct, error: findError } = await supabase
    .from("products")
    .select("user_id")
    .eq("id", id)
    .single();

  if (findError || foundProduct?.user_id !== user.id) {
    throw new Error("수정 권한이 없습니다.");
  }

  // 대표 이미지 삭제
  if (oldImageUrl && oldImageUrl !== image_url) {
    const oldImagePath = extractFilePathFromUrl(oldImageUrl, bucket!);
    if (oldImagePath) {
      const { error: removeError } = await supabase.storage
        .from(bucket!)
        .remove([oldImagePath]);
      if (removeError) {
        console.warn("기존 대표 이미지 삭제 실패:", removeError.message);
      }
    }
  }

  // 기존 상세 이미지 목록 가져오기
  const { data: existingImagesData, error: existingImagesError } =
    await supabase
      .from("product_images")
      .select("id, image_url")
      .eq("product_id", id);

  if (existingImagesError) {
    throw new Error(
      "기존 상세 이미지 조회 실패: " + existingImagesError.message,
    );
  }

  const existingIds = new Set((existingImagesData ?? []).map((img) => img.id));
  const keptIds = new Set(oldDetailImageIds);

  // 삭제 대상 ID 계산
  const idsToDelete = [...existingIds].filter((id) => !keptIds.has(id));

  if (idsToDelete.length > 0) {
    const targets = (existingImagesData ?? []).filter((img) =>
      idsToDelete.includes(img.id),
    );

    const deletePaths = targets
      .map((img) => extractFilePathFromUrl(img.image_url, bucket!))
      .filter((path): path is string => typeof path === "string");

    if (deletePaths.length > 0) {
      const { error: removeDetailError } = await supabase.storage
        .from(bucket!)
        .remove(deletePaths);

      if (removeDetailError) {
        console.warn(
          "상세 이미지 Storage 삭제 실패:",
          removeDetailError.message,
        );
      }
    }

    const { error: deleteFromDbError } = await supabase
      .from("product_images")
      .delete()
      .in("id", idsToDelete);

    if (deleteFromDbError) {
      console.warn("상세 이미지 DB 삭제 실패:", deleteFromDbError.message);
    }
  }

  // 상품 정보 업데이트
  const { data, error } = await supabase
    .from("products")
    .update({ name, description, price, image_url })
    .eq("id", id);

  if (error) {
    console.error("상품 수정 실패:", error.message);
    throw new Error(error.message);
  }

  // 전체 이미지 목록을 정렬 순서 포함하여 덮어쓰기
  const inserts = detail_image_urls.map((url, index) => ({
    product_id: id,
    image_url: url,
    sort_order: index,
  }));

  if (detail_image_urls && oldDetailImageIds) {
    const { error: insertError } = await supabase
      .from("product_images")
      .upsert(inserts, {
        onConflict: "product_id, sort_order",
      });

    if (insertError) {
      console.warn("새 상세 이미지 삽입 실패:", insertError.message);
      throw new Error("새로운 상세 이미지 저장 실패: " + insertError.message);
    }
  }

  return data;
}
