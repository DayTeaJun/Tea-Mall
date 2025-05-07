"use server";

import { ProductAllType } from "@/app/(admin)/productRegist/type";
import { createServerSupabaseClient } from "../config/supabase/server/server";

export async function createProduct({
  name,
  description,
  price,
  imageUrl,
}: ProductAllType) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("products").insert([
    {
      name,
      description,
      price,
      image_url: imageUrl,
    },
  ]);
  if (error) {
    console.error("상품 등록 실패:", error.message);
    throw new Error(error.message);
  }
  return data;
}
