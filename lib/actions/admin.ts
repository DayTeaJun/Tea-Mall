"use server";

import { ProductType } from "@/types/product";
import { createServerSupabaseClient } from "../config/supabase/server/server";

export async function createProduct({
  name,
  description,
  price,
  image_url,
}: ProductType) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return alert("로그인 후 사용해주세요.");
  }

  const { data, error } = await supabase.from("products").insert([
    {
      name,
      description,
      price,
      image_url: image_url,
      user_id: user?.id,
    },
  ]);
  if (error) {
    console.error("상품 등록 실패:", error.message);
    throw new Error(error.message);
  }
  return data;
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
}: ProductType) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    throw new Error("로그인 후 사용해주세요.");
  }

  if (!id) {
    throw new Error("잘못된 접근입니다.");
  }

  // 본인 상품인지 확인 (선택적 보안 절차)
  const { data: foundProduct, error: findError } = await supabase
    .from("products")
    .select("user_id")
    .eq("id", id)
    .single();

  if (findError || foundProduct?.user_id !== user.id) {
    throw new Error("수정 권한이 없습니다.");
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name,
      description,
      price,
      image_url,
    })
    .eq("id", id);

  if (error) {
    console.error("상품 수정 실패:", error.message);
    throw new Error(error.message);
  }

  return data;
}
