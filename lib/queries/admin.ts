import { v4 as uuid } from "uuid";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";

// 이미지 업로드
export async function uploadImageToStorage(file: File): Promise<string | null> {
  const supabase = createBrowserSupabaseClient();
  const fileName = `${uuid()}-${file.name}`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(fileName, file);
  if (error) return null;
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);
  return data.publicUrl;
}
