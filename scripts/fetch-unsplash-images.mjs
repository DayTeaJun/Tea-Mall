#!/usr/bin/env node
/**
 * Unsplash에서 키워드로 사진을 검색해 로컬 폴더에 다운로드만 하는 스크립트.
 * (업로드/DB 등록은 하지 않음 - 받은 사진을 직접 확인하고 관리자 상품등록에서 사용)
 *
 * 사용법:
 *   node scripts/fetch-unsplash-images.mjs "여성 자켓" 10
 *   node scripts/fetch-unsplash-images.mjs "운동화" 15 sneakers
 *
 */

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ---- .env 로드 (recompress-images.mjs와 동일한 방식) ----
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

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
if (!ACCESS_KEY) {
  console.error("UNSPLASH_ACCESS_KEY 환경변수가 필요합니다 (.env 확인).");
  process.exit(1);
}

const [keyword, countArg, folderArg] = process.argv.slice(2);
if (!keyword) {
  console.error(
    '사용법: node scripts/fetch-unsplash-images.mjs "검색어" [개수] [저장폴더명]',
  );
  process.exit(1);
}

const count = Math.min(Number(countArg) || 10, 30); // Unsplash 검색 API 페이지당 최대치 고려
const folderName = folderArg || keyword.replace(/\s+/g, "-");
const outDir = join(__dirname, "downloaded-images", folderName);
mkdirSync(outDir, { recursive: true });

async function searchPhotos(query, perPage) {
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query,
  )}&per_page=${perPage}&content_filter=high`;

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`Unsplash 검색 실패 (${res.status}): ${await res.text()}`);
  }

  const data = await res.json();
  return data.results;
}

// Unsplash API 가이드라인: 실제로 사진을 사용(다운로드)할 때는
// download_location 엔드포인트를 한 번 호출해줘야 함
async function trackDownload(downloadLocation) {
  try {
    await fetch(downloadLocation, {
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    });
  } catch {
    // 다운로드 트래킹 실패는 무시 (실제 파일 저장에는 영향 없음)
  }
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`이미지 다운로드 실패 (${res.status})`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(destPath, buffer);
  return buffer.byteLength;
}

async function run() {
  console.log(`"${keyword}" 검색 중... (${count}장)\n`);

  const photos = await searchPhotos(keyword, count);
  if (photos.length === 0) {
    console.log("검색 결과가 없습니다.");
    return;
  }

  let saved = 0;
  for (const [i, photo] of photos.entries()) {
    const filename = `${String(i + 1).padStart(2, "0")}_${photo.id}.jpg`;
    const destPath = join(outDir, filename);

    try {
      const bytes = await downloadImage(photo.urls.regular, destPath);
      await trackDownload(photo.links.download_location);
      console.log(
        `  ✅ ${filename}  (${(bytes / 1024).toFixed(0)}KB)  by ${photo.user.name}`,
      );
      saved++;
    } catch (e) {
      console.log(`  ❌ ${filename} - ${e.message}`);
    }
  }

  console.log(`\n${saved}/${photos.length}장 저장 완료 → ${outDir}`);
}

run().catch((e) => {
  console.error("스크립트 실행 중 오류:", e);
  process.exit(1);
});
