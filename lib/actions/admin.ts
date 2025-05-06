"use server";

import { createServerSupabaseClient } from "../config/supabase/server/server";

export async function createProduct({
  name,
  description,
  price,
  imageUrl,
}: {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}) {
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
