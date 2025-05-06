import { v4 as uuidv4 } from "uuid";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";

// 이미지 업로드
export async function uploadImageToStorage(file: File): Promise<string | null> {
  const supabase = createBrowserSupabaseClient();
  const fileName = `${uuidv4()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Upload Error:", uploadError.message);
    return null;
  }

  // ✅ 여기서 public URL 가져오기
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(fileName);

  return data?.publicUrl ?? null;
}
