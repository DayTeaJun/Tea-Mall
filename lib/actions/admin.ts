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

export async function deleteProduct(productId: string, imagePath: string) {
  const supabase = await createServerSupabaseClient();

  const { error: imageDeleteError } = await supabase.storage
    .from("product-images")
    .remove([imagePath]);

  if (imageDeleteError) {
    throw new Error("이미지 삭제 실패: " + imageDeleteError.message);
  }

  const { error: productDeleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", productId);

  if (productDeleteError) {
    throw new Error("상품 삭제 실패: " + productDeleteError.message);
  }
}
