/**
 * 브라우저 canvas를 이용해 업로드 전 이미지를 리사이즈/압축
 * 압축 없이 원본(수 MB) 그대로 Supabase Storage에 올라가면서
 * 업로드 용량뿐 아니라 이후 조회 시 egress(대역폭)까지 계속 소모하는 문제를 막기 위함
 *
 * - 브라우저 환경 전용(document/canvas 사용). 서버 컴포넌트/액션에서는 호출안함
 * - GIF는 압축 시 애니메이션이 깨지므로 건드리지 않음
 * - 압축 결과가 원본보다 크거나(예: 이미 최적화된 파일) 실패하면 원본 파일을 그대로 반환
 */

export interface CompressImageOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0~1
}

const DEFAULT_OPTIONS: Required<CompressImageOptions> = {
  maxWidth: 1600,
  maxHeight: 1600,
  quality: 0.8,
};

// 업로드 목적별 프리셋 (화질 우선순위가 다르므로 구분해서 사용)
export const IMAGE_COMPRESS_PRESETS = {
  // 상품 메인/상세 이미지 - 구매 결정에 직결되므로 화질 우선
  product: { maxWidth: 2000, maxHeight: 2000, quality: 0.88 },
  // 리뷰 첨부 이미지
  review: { maxWidth: 1600, maxHeight: 1600, quality: 0.8 },
  // 고객 문의 첨부 이미지 - 화질보다 용량 우선
  inquiry: { maxWidth: 1200, maxHeight: 1200, quality: 0.75 },
  // 프로필 아바타 - 최대 128px 원형으로만 표시됨
  avatar: { maxWidth: 480, maxHeight: 480, quality: 0.85 },
} as const satisfies Record<string, Required<CompressImageOptions>>;

// 이 크기 이하이면 압축해도 이득이 크지 않으므로 건너뜀
const SKIP_COMPRESSION_UNDER_BYTES = 500 * 1024; // 500KB

export async function compressImage(
  file: File,
  options: CompressImageOptions = {},
): Promise<File> {
  if (typeof document === "undefined") return file; // SSR 안전장치

  if (file.type === "image/gif") return file;
  if (file.size <= SKIP_COMPRESSION_UNDER_BYTES) return file;

  const { maxWidth, maxHeight, quality } = { ...DEFAULT_OPTIONS, ...options };

  try {
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(
      maxWidth / bitmap.width,
      maxHeight / bitmap.height,
      1, // 원본보다 키우지는 않음
    );
    const width = Math.round(bitmap.width * ratio);
    const height = Math.round(bitmap.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", quality),
    );

    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^./\\]+$/, "") + ".jpg";
    return new File([blob], newName, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (e) {
    console.error("이미지 압축 실패, 원본으로 업로드합니다:", e);
    return file;
  }
}
