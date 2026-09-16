import { v4 as uuidv4 } from "uuid";
import { createBrowserSupabaseClient } from "@/lib/config/supabase/client";
import { compressImage, IMAGE_COMPRESS_PRESETS } from "@/lib/utils/imageCompression";

// 이미지 업로드 용도별 버킷/압축/저장 정책
// (product-images 버킷은 product/review가 같이 씀 - review는 "reviews/" 하위 경로로 분리)
const UPLOAD_PRESETS = {
  product: {
    bucket: "product-images",
    compressPreset: IMAGE_COMPRESS_PRESETS.product,
    upsert: false,
    cacheControl: "3600",
  },
  inquiry: {
    bucket: "inquiry-images",
    compressPreset: IMAGE_COMPRESS_PRESETS.inquiry,
    upsert: false,
    cacheControl: "3600",
  },
  avatar: {
    bucket: process.env.NEXT_PUBLIC_STORAGE_USER_BUCKET,
    compressPreset: IMAGE_COMPRESS_PRESETS.avatar,
    upsert: true,
  },
  review: {
    bucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    compressPreset: IMAGE_COMPRESS_PRESETS.review,
    upsert: true,
    pathPrefix: "reviews",
  },
} as const;

export type UploadPurpose = keyof typeof UPLOAD_PRESETS;

// 이미지 업로드 (압축 → Storage 업로드 → 공개 URL 반환)
// 상품/문의/프로필/리뷰 이미지 업로드가 전부 이 함수 하나를 공유함
export const uploadImageToStorage = async (
  purpose: UploadPurpose,
  userId: string,
  file: File,
): Promise<string> => {
  const preset = UPLOAD_PRESETS[purpose];
  const bucket = preset.bucket;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!bucket || !projectUrl) {
    throw new Error("Storage 관련 환경 변수가 설정되지 않았습니다.");
  }

  const supabase = createBrowserSupabaseClient();
  const compressedFile = await compressImage(file, preset.compressPreset);
  const cleanFileName = compressedFile.name.replace(/[^\w.-]/g, "");
  const pathPrefix = "pathPrefix" in preset ? preset.pathPrefix : undefined;
  const fileName = pathPrefix
    ? `${pathPrefix}/${userId}/${uuidv4()}-${cleanFileName}`
    : `${userId}/${uuidv4()}-${cleanFileName}`;

  const { data, error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, compressedFile, {
      upsert: preset.upsert,
      cacheControl: "cacheControl" in preset ? preset.cacheControl : undefined,
      contentType: compressedFile.type,
    });

  if (uploadError || !data?.path) {
    console.error("이미지 업로드 실패:", uploadError?.message);
    throw new Error(
      `이미지 업로드에 실패했습니다${uploadError?.message ? `: ${uploadError.message}` : "."}`,
    );
  }

  return `${projectUrl}/storage/v1/object/public/${bucket}/${data.path}`;
};
