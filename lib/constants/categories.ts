// 카테고리/서브카테고리/사이즈 체계를 한 곳에서 관리.
// 상품 등록(ProductForm)·수정(EditProductForm)·검색 필터가 전부 이 값을 공유함 -

export const CATEGORY_MAP: Record<string, string[]> = {
  의류: ["아우터", "상의", "하의", "원피스"],
  신발: ["스니커즈", "구두", "부츠", "샌들"],
  가방: ["백팩", "숄더백", "크로스백", "클러치"],
  액세서리: ["모자", "벨트", "지갑", "기타"],
};

// 카테고리별 사이즈 체계. 빈 배열이면 사이즈 구분이 없는 카테고리로,
// 재고는 stock_by_size = { FREE: 수량 } 형태로 저장됨 (ProductForm 참고).
export const SIZE_OPTIONS_MAP: Record<string, string[]> = {
  의류: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
  신발: ["230", "240", "250", "260", "270", "280"],
  가방: [],
  액세서리: [],
};

// 카테고리 구분 없이(검색 페이지처럼) 사이즈로 필터링할 때 보여줄 전체 목록.
// 카테고리별로 그룹을 나눠서 보여주기 위한 용도.
export const SIZE_FILTER_GROUPS = Object.entries(SIZE_OPTIONS_MAP).filter(
  ([, sizes]) => sizes.length > 0,
);
