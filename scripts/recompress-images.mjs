#!/usr/bin/env node
/**
 * Supabase Storage에 이미 올라가있는 (압축 전) 이미지를 다시 압축해서
 * 같은 경로에 덮어쓰는 1회성 마이그레이션 스크립트.
 *
 * DB의 image_url 등은 경로를 그대로 유지하므로 전혀 건드리지 않음 -
 * Storage의 실제 파일 내용물만 가벼운 버전으로 교체됨.
 *
 * 사용법:
 *   node scripts/recompress-images.mjs --dry-run   (미리보기만, 실제 업로드 안 함)
 *   node scripts/recompress-images.mjs              (실제로 압축 + 재업로드)
 *
 * 프리셋은 lib/utils/imageCompression.ts의 IMAGE_COMPRESS_PRESETS와
 * 반드시 동일하게 유지할 것.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- .env 로드 (Node 18엔 --env-file이 없어서 직접 파싱) ----
function loadEnv() {
  const envPath = join(__dirname, "..", ".env");
  const content = readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}
loadEnv();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.NEXT_SUPABASE_SERVICE_ROLE;
const PRODUCT_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "product-images";
const INQUIRY_BUCKET = "inquiry-images";
const AVATAR_BUCKET = process.env.NEXT_PUBLIC_STORAGE_USER_BUCKET;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_SUPABASE_SERVICE_ROLE 환경변수가 필요합니다 (.env 확인).",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

const DRY_RUN = process.argv.includes("--dry-run");
const SKIP_UNDER_BYTES = 500 * 1024; // lib/utils/imageCompression.ts와 동일한 기준

// lib/utils/imageCompression.ts의 IMAGE_COMPRESS_PRESETS와 동일하게 유지
const PRESETS = {
  product: { maxWidth: 2000, maxHeight: 2000, quality: 88 },
  inquiry: { maxWidth: 1200, maxHeight: 1200, quality: 75 },
  avatar: { maxWidth: 480, maxHeight: 480, quality: 85 },
  review: { maxWidth: 1600, maxHeight: 1600, quality: 80 },
};

// 버킷 이름 + 경로를 보고 이 파일에 적용할 압축 프리셋(해상도/화질)을 고름
function presetForPath(bucket, path) {
  if (bucket === PRODUCT_BUCKET) {
    // product-images 버킷 안에는 상품 이미지와 리뷰 이미지가 같이 있음
    // (리뷰는 "reviews/{userId}/..." 경로로 구분됨)
    return path.startsWith("reviews/") ? PRESETS.review : PRESETS.product;
  }
  if (bucket === INQUIRY_BUCKET) return PRESETS.inquiry;
  if (bucket === AVATAR_BUCKET) return PRESETS.avatar;
  return PRESETS.product;
}

// GIF는 압축하면 애니메이션이 깨지므로 건드리지 않기 위한 판별 함수
function isGif(path) {
  return path.toLowerCase().endsWith(".gif");
}

// 바이트 숫자를 "1234.5KB" 형태로 보기 좋게 출력용으로 변환
function fmtBytes(n) {
  return `${(n / 1024).toFixed(1)}KB`;
}

// Storage list()는 한 계층만 반환하므로 폴더를 만나면 재귀적으로 순회
async function listAllFiles(bucket, prefix = "") {
  const files = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(prefix, { limit, offset, sortBy: { column: "name", order: "asc" } });

    if (error) throw new Error(`list(${bucket}/${prefix}) 실패: ${error.message}`);
    if (!data || data.length === 0) break;

    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      // Supabase Storage 관례: 폴더는 id가 null로 옴
      if (item.id === null) {
        const sub = await listAllFiles(bucket, path);
        files.push(...sub);
      } else {
        files.push(path);
      }
    }

    if (data.length < limit) break;
    offset += limit;
  }

  return files;
}

// 파일 하나를 다운로드 → (필요하면) sharp로 리사이즈/압축 →
// DRY_RUN이 아니면 같은 경로에 upsert로 재업로드. 이미 작거나 GIF거나
// 압축해도 안 줄어들면 원본을 그대로 두고 skipped 사유를 반환함
async function processFile(bucket, path) {
  if (isGif(path)) {
    return { path, skipped: "gif" };
  }

  const { data: blob, error: downloadError } = await supabase.storage
    .from(bucket)
    .download(path);
  if (downloadError) {
    return { path, error: downloadError.message };
  }

  const originalBuffer = Buffer.from(await blob.arrayBuffer());
  if (originalBuffer.byteLength <= SKIP_UNDER_BYTES) {
    return { path, skipped: "already-small", originalSize: originalBuffer.byteLength };
  }

  const preset = presetForPath(bucket, path);

  let compressedBuffer;
  try {
    compressedBuffer = await sharp(originalBuffer)
      .resize(preset.maxWidth, preset.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: preset.quality })
      .toBuffer();
  } catch (e) {
    return { path, error: `압축 실패: ${e.message}` };
  }

  if (compressedBuffer.byteLength >= originalBuffer.byteLength) {
    return {
      path,
      skipped: "no-improvement",
      originalSize: originalBuffer.byteLength,
      newSize: compressedBuffer.byteLength,
    };
  }

  if (!DRY_RUN) {
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, compressedBuffer, {
        upsert: true,
        contentType: "image/jpeg",
      });
    if (uploadError) {
      return { path, error: `업로드 실패: ${uploadError.message}` };
    }
  }

  return {
    path,
    originalSize: originalBuffer.byteLength,
    newSize: compressedBuffer.byteLength,
    saved: originalBuffer.byteLength - compressedBuffer.byteLength,
  };
}

// 버킷 3개(product-images/inquiry-images/user-profile)를 순서대로 돌면서
// 모든 파일을 찾아 processFile로 처리하고, 마지막에 전체 결과를 요약 출력
async function run() {
  console.log(
    DRY_RUN ? "🔍 DRY RUN 모드 (실제 업로드는 안 함)\n" : "🚀 실제 압축 + 재업로드 진행\n",
  );

  const buckets = [PRODUCT_BUCKET, INQUIRY_BUCKET, AVATAR_BUCKET].filter(Boolean);

  let totalFiles = 0;
  let totalCompressed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let totalSaved = 0;

  for (const bucket of buckets) {
    console.log(`\n=== 버킷: ${bucket} ===`);
    const files = await listAllFiles(bucket);
    console.log(`파일 ${files.length}개 발견`);

    for (const path of files) {
      totalFiles++;
      const result = await processFile(bucket, path);

      if (result.error) {
        totalErrors++;
        console.log(`  ❌ ${path} - ${result.error}`);
      } else if (result.skipped) {
        totalSkipped++;
      } else {
        totalCompressed++;
        totalSaved += result.saved;
        const pct = ((result.saved / result.originalSize) * 100).toFixed(0);
        console.log(
          `  ✅ ${path}  ${fmtBytes(result.originalSize)} → ${fmtBytes(result.newSize)} (-${pct}%)`,
        );
      }
    }
  }

  console.log("\n=== 요약 ===");
  console.log(`전체 파일: ${totalFiles}`);
  console.log(`압축됨: ${totalCompressed}`);
  console.log(`건너뜀(이미 작음/GIF/개선없음): ${totalSkipped}`);
  console.log(`에러: ${totalErrors}`);
  console.log(`절약된 용량: ${(totalSaved / 1024 / 1024).toFixed(2)}MB`);
  if (DRY_RUN) {
    console.log("\n실제로 적용하려면 --dry-run 없이 다시 실행하세요.");
  }
}

run().catch((e) => {
  console.error("스크립트 실행 중 오류:", e);
  process.exit(1);
});
