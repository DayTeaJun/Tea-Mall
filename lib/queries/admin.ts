import { v4 as uuidv4 } from "uuid";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";

export async function uploadImageToStorage(file: File): Promise<string> {
  const supabase = createBrowserSupabaseClient();
  const bucket = process.env.NEXT_PUBLIC_STORAGE_BUCKET;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const fileName = `${uuidv4()}-${file.name}`;

  if (!bucket || !projectUrl) {
    throw new Error("env 설정 안했음");
  }

  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError || !data?.path) {
    console.error("이미지 업로드 실패:", uploadError?.message);
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  const publicUrl = `${projectUrl}/storage/v1/object/public/${bucket}/${data.path}`;
  return publicUrl;
}
