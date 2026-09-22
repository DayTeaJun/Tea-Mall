#!/usr/bin/env node
/**
 * scripts/downloaded-images/ 안의 카테고리별 사진(Unsplash에서 받은 더미 사진)으로
 * products / product_images 테이블에 샘플 상품을 채워넣는 1회성 시드 스크립트.
 *
 * - 이미지는 lib/utils/imageCompression.ts의 product 프리셋과 동일하게 sharp로 압축 후
 *   product-images 버킷에 업로드 (lib/queries/storage.ts의 경로 규칙과 동일: {userId}/{uuid}-{파일명})
 * - 각 카테고리 폴더의 4장 중 1장을 대표 이미지, 나머지 3장을 상세 이미지로 사용
 *
 * 사용법:
 *   node scripts/seed-products-from-images.mjs                  (전체 등록)
 *   node scripts/seed-products-from-images.mjs boots,sandals    (해당 폴더만 등록 - 이미 등록한 상품 중복 방지용)
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));

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
const BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET || "product-images";
const USER_ID = "394bfb31-61d7-44ce-8dd8-0e9ef0aa60a5";

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_SUPABASE_SERVICE_ROLE 환경변수가 필요합니다 (.env 확인).",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

// lib/utils/imageCompression.ts의 product 프리셋과 동일
const PRODUCT_PRESET = { maxWidth: 2000, maxHeight: 2000, quality: 88 };

const IMAGES_ROOT = join(__dirname, "downloaded-images");

// 카테고리 폴더 ↔ 실제 상품 데이터 매핑
const PRODUCTS = [
  {
    folder: "outer",
    name: "울 블렌드 오버사이즈 코트",
    description:
      "포근한 울 블렌드 원단으로 완성한 오버사이즈 코트입니다. 어떤 스타일에도 무난하게 매치할 수 있는 차콜그레이 컬러로, 가을부터 초겨울까지 활용도 높게 착용하실 수 있습니다.",
    category: "의류",
    subcategory: "아우터",
    gender: "남성",
    color: "차콜그레이",
    price: 129000,
    originalPrice: 159000,
    discountType: "percentage",
    discountValue: 19,
    tags: ["가을", "아우터", "오버사이즈"],
    stockBySize: { S: 5, M: 10, L: 8 },
  },
  {
    folder: "top",
    name: "베이직 코튼 오버핏 셔츠",
    description:
      "부드러운 촉감의 순면 소재로 제작한 오버핏 셔츠입니다. 캐주얼부터 오피스룩까지 다양한 스타일링이 가능한 베이직 아이템입니다.",
    category: "의류",
    subcategory: "상의",
    gender: "여성",
    color: "화이트",
    price: 39000,
    tags: ["데일리", "셔츠", "오피스룩"],
    stockBySize: { S: 12, M: 14, L: 9 },
  },
  {
    folder: "bottom",
    name: "스트레이트핏 워싱 데님 팬츠",
    description:
      "탄탄한 워싱 가공으로 자연스러운 색감을 살린 스트레이트핏 데님 팬츠입니다. 부담 없는 실루엣으로 캐주얼한 데일리룩에 잘 어울립니다.",
    category: "의류",
    subcategory: "하의",
    gender: "남성",
    color: "미디엄 블루",
    price: 59000,
    tags: ["데님", "캐주얼", "스트레이트핏"],
    stockBySize: { S: 6, M: 13, L: 11 },
  },
  {
    folder: "dress",
    name: "미디 랩 원피스",
    description:
      "허리 라인을 자연스럽게 강조해주는 랩 스타일의 미디 원피스입니다. 하나만 입어도 완성되는 여성스러운 실루엣으로 다양한 자리에 어울립니다.",
    category: "의류",
    subcategory: "원피스",
    gender: "여성",
    color: "딥그린",
    price: 79000,
    originalPrice: 99000,
    discountType: "percentage",
    discountValue: 20,
    tags: ["원피스", "여성스러운", "데이트룩"],
    stockBySize: { S: 7, M: 9, L: 5 },
  },
  {
    folder: "shoes",
    name: "클래식 로우탑 스니커즈",
    description:
      "어떤 코디에도 무난하게 어울리는 화이트 컬러의 클래식 로우탑 스니커즈입니다. 쿠셔닝이 우수한 밑창으로 하루 종일 편안하게 착용할 수 있습니다.",
    category: "신발",
    subcategory: "스니커즈",
    gender: "남성",
    color: "화이트",
    price: 89000,
    tags: ["스니커즈", "캐주얼", "데일리슈즈"],
    stockBySize: { "250": 6, "260": 10, "270": 8 },
  },
  {
    folder: "bag",
    name: "미니멀 레더 숄더백",
    description:
      "고급스러운 가죽 소재와 심플한 디자인이 돋보이는 미니멀 숄더백입니다. 데일리부터 특별한 자리까지 다양하게 활용 가능한 실용적인 사이즈입니다.",
    category: "가방",
    subcategory: "숄더백",
    gender: "여성",
    color: "브라운",
    price: 129000,
    originalPrice: 159000,
    discountType: "fixed",
    discountValue: 30000,
    tags: ["가방", "레더", "미니멀"],
    stockBySize: { FREE: 20 },
  },
  {
    folder: "accessory",
    name: "데일리 포인트 액세서리 세트",
    description:
      "심플한 룩에 포인트를 더해줄 데일리 액세서리입니다. 어떤 스타일에도 부담 없이 매치할 수 있어 선물용으로도 좋습니다.",
    category: "액세서리",
    subcategory: "기타",
    gender: "여성",
    color: "실버",
    price: 29000,
    tags: ["액세서리", "포인트아이템", "선물추천"],
    stockBySize: { FREE: 30 },
  },
  {
    folder: "dressshoes",
    name: "포인티토 레더 더비슈즈",
    description:
      "매끈한 가죽 소재와 포인티드 토로 완성한 정장용 더비슈즈입니다. 비즈니스룩은 물론 격식 있는 자리에도 잘 어울립니다.",
    category: "신발",
    subcategory: "구두",
    gender: "남성",
    color: "블랙",
    price: 99000,
    tags: ["구두", "포멀", "가죽"],
    stockBySize: { "250": 5, "260": 9, "270": 6 },
  },
  {
    folder: "boots",
    name: "첼시 앵클 부츠",
    description:
      "깔끔한 실루엣의 첼시 앵클 부츠로, 가을·겨울 시즌 어떤 하의와도 무난하게 매치됩니다. 부드러운 밑창으로 착화감도 우수합니다.",
    category: "신발",
    subcategory: "부츠",
    gender: "여성",
    color: "브라운",
    price: 119000,
    tags: ["부츠", "가을겨울", "앵클부츠"],
    stockBySize: { "230": 4, "240": 8, "250": 7 },
  },
  {
    folder: "sandals",
    name: "스트랩 플랫 샌들",
    description:
      "여름철 시원한 착용감을 주는 스트랩 디자인의 플랫 샌들입니다. 가벼운 무게감으로 오래 걸어도 편안합니다.",
    category: "신발",
    subcategory: "샌들",
    gender: "여성",
    color: "베이지",
    price: 45000,
    tags: ["샌들", "여름", "플랫슈즈"],
    stockBySize: { "230": 6, "240": 10, "250": 8 },
  },
  {
    folder: "backpack",
    name: "캔버스 데일리 백팩",
    description:
      "튼튼한 캔버스 원단으로 제작한 데일리 백팩입니다. 노트북 수납이 가능한 넉넉한 공간으로 통학·출근룩에 실용적입니다.",
    category: "가방",
    subcategory: "백팩",
    gender: "남성",
    color: "카키",
    price: 69000,
    tags: ["백팩", "데일리", "캠퍼스룩"],
    stockBySize: { FREE: 25 },
  },
];

// 원본 이미지를 product 프리셋으로 압축 후 업로드하고 공개 URL을 반환
async function compressAndUpload(localPath) {
  const originalBuffer = readFileSync(localPath);
  const compressedBuffer = await sharp(originalBuffer)
    .resize(PRODUCT_PRESET.maxWidth, PRODUCT_PRESET.maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: PRODUCT_PRESET.quality })
    .toBuffer();

  const path = `${USER_ID}/${randomUUID()}-seed.jpg`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, compressedBuffer, {
      upsert: false,
      cacheControl: "3600",
      contentType: "image/jpeg",
    });

  if (error || !data?.path) {
    throw new Error(`업로드 실패: ${error?.message}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${data.path}`;
}

async function seedProduct(def) {
  const dir = join(IMAGES_ROOT, def.folder);
  const files = readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith(".jpg"))
    .sort();

  if (files.length === 0) {
    console.log(`  ⚠️  ${def.folder}: 이미지가 없어 건너뜀`);
    return;
  }

  const [mainFile, ...detailFiles] = files;

  console.log(`\n=== ${def.name} (${def.category}/${def.subcategory}) ===`);

  const mainUrl = await compressAndUpload(join(dir, mainFile));
  console.log(`  대표 이미지 업로드 완료: ${mainFile}`);

  const detailUrls = [];
  for (const f of detailFiles) {
    detailUrls.push(await compressAndUpload(join(dir, f)));
    console.log(`  상세 이미지 업로드 완료: ${f}`);
  }

  const totalStock = Object.values(def.stockBySize).reduce(
    (sum, n) => sum + n,
    0,
  );

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert([
      {
        name: def.name,
        description: def.description,
        price: def.price,
        original_price: def.originalPrice ?? null,
        discount_type: def.discountType ?? null,
        discount_value: def.discountValue ?? null,
        image_url: mainUrl,
        user_id: USER_ID,
        tags: def.tags,
        category: def.category,
        subcategory: def.subcategory,
        gender: def.gender,
        color: def.color,
        stock_by_size: def.stockBySize,
        total_stock: totalStock,
      },
    ])
    .select()
    .single();

  if (productError) {
    throw new Error(`상품 등록 실패: ${productError.message}`);
  }

  if (detailUrls.length > 0) {
    const imageRecords = detailUrls.map((url, index) => ({
      product_id: product.id,
      image_url: url,
      sort_order: index,
    }));
    const { error: detailError } = await supabase
      .from("product_images")
      .insert(imageRecords);

    if (detailError) {
      throw new Error(`상세 이미지 등록 실패: ${detailError.message}`);
    }
  }

  console.log(`  ✅ 등록 완료 (id: ${product.id}, 재고 ${totalStock}개)`);
}

async function run() {
  const filterArg = process.argv[2];
  const targetFolders = filterArg ? filterArg.split(",") : null;
  const targets = targetFolders
    ? PRODUCTS.filter((p) => targetFolders.includes(p.folder))
    : PRODUCTS;

  console.log(`시드 상품 ${targets.length}개 등록 시작 (user_id: ${USER_ID})`);

  for (const def of targets) {
    await seedProduct(def);
  }

  console.log("\n모든 상품 등록이 끝났습니다.");
}

run().catch((e) => {
  console.error("스크립트 실행 중 오류:", e);
  process.exit(1);
});
