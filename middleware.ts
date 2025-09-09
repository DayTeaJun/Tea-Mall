import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/config/supabase/server/middleware";

// 로그인 필요
const protectedRoutes = [
  "/mypage",
  "/myCart",
  "/products/manage",
  "/products/regist",
  "/products/orderList",
  "/productReview",
  "/directCheckout",
];

// 비로그인 전용
const publicRoutes = ["/signin", "/signup"];

// 권한 라우트
const adminRoutes = ["/admin"];
const sellerRoutes = ["/products/manage", "/products/regist"];

// 온보딩/인증/정적 등 예외(리다이렉트 루프 방지)
const onboardingSafePrefixes = [
  "/onboarding",
  "/auth",
  "/api",
  "/_next",
  "/favicon.ico",
];

export async function middleware(request: NextRequest) {
  const { response, isLoggedIn, level, username } = await updateSession(
    request,
  );
  const { pathname, search } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isSellerRoute = sellerRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isSafe = onboardingSafePrefixes.some((p) => pathname.startsWith(p));

  // 0) 비로그인 + 보호 경로 → /signin
  if (!isLoggedIn && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin"; // ✅ 실제 URL
    return NextResponse.redirect(url);
  }

  // 1) 로그인 + username 없음 → /onboarding (예외 경로 제외)
  if (isLoggedIn && username == null && !isSafe) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding"; // ✅ 실제 URL
    const returnTo = pathname + (search || "");
    url.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(url);
  }

  // 2) 로그인 + public 경로 접근 → 홈
  if (isLoggedIn && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 3) 셀러 권한 체크
  if (isLoggedIn && level !== null && level < 2 && isSellerRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/not-found";
    return NextResponse.redirect(url);
  }

  // 4) 관리자 권한 체크
  if (isLoggedIn && level !== 3 && isAdminRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/not-found";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
