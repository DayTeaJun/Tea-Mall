import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/config/supabase/server/middleware";

// 일반 로그인 유저 전용 (비로그인 접근 시 /signin 으로 유도할 경로)
const protectedRoutes = [
  "/mypage",
  "/myCart",
  "/productReview",
  "/directCheckout",
];

// 비로그인 전용
const publicRoutes = ["/signin", "/signup"];

// 특수 권한 필요 라우트 (비로그인이거나 권한 없으면 무조건 / 로 튕겨냄)
const adminRoutes = ["/admin"];
const sellerRoutes = ["/manage"];

// 예외 경로
const safePrefixes = [
  "/inquiry",
  "/onboarding",
  "/auth",
  "/api",
  "/_next",
  "/favicon.ico",
];

export async function middleware(request: NextRequest) {
  const { response, isLoggedIn, level, username, status } =
    await updateSession(request);
  const { pathname, search } = request.nextUrl;

  response.headers.set("x-pathname", pathname);

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isSellerRoute = sellerRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isSafe = safePrefixes.some((p) => pathname.startsWith(p));

  // 1) 셀러 페이지 접근 제어 (비로그인이거나 레벨이 2 미만이면 로그인창 안 가고 바로 메인 / 로)
  if (isSellerRoute && (!isLoggedIn || level === null || level < 2)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 2) 관리자 페이지 접근 제어 (비로그인이거나 레벨이 3이 아니면 바로 메인 / 로)
  if (isAdminRoute && (!isLoggedIn || level !== 3)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 3) 일반 사용자 로그인 필요 경로만 /signin 으로 리다이렉트
  if (!isLoggedIn && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    const returnTo = pathname + (search || "");
    url.searchParams.set("redirectTo", returnTo);
    return NextResponse.redirect(url);
  }

  // 4) 로그인 + username 없음 → /onboarding
  if (isLoggedIn && username == null && !isSafe) {
    const clean = new URL("/onboarding", request.url);
    const returnTo = pathname + (search || "");
    clean.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(clean);
  }

  // 5) 로그인 상태에서 public(signin/signup) 접근 시 처리
  if (isLoggedIn && isPublic) {
    const url = request.nextUrl.clone();
    const redirectTo = request.nextUrl.searchParams.get("redirectTo") || "/";
    url.pathname = redirectTo;
    url.search = "";
    return NextResponse.redirect(url);
  }

  // 6) 정지 계정 → 메인 / 로
  if (isLoggedIn && status === "suspended" && !isSafe) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
