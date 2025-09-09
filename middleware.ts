import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/config/supabase/server/middleware";

const protectedRoutes = [
  "/mypage",
  "/myCart",
  "/products/manage",
  "/products/regist",
  "/products/orderList",
  "/productReview",
  "/directCheckout",
];

const publicRoutes = ["/signin", "/signup"];
const adminRoutes = ["/admin"];
const sellerRoutes = ["/products/manage", "/products/regist"];

// 온보딩/인증 등은 루프 방지 위해 예외
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
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));
  const isOnboardingSafe = onboardingSafePrefixes.some((p) =>
    pathname.startsWith(p),
  );

  // 0) 로그인 안 됐고 보호 경로면 로그인 페이지로
  if (!isLoggedIn && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // 1) 로그인 상태에서 level이 비어 있으면(=null) 온보딩으로 보냄 (예외 경로 제외)
  if (isLoggedIn && username == null && !isOnboardingSafe) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    // 원래 가려던 목적지 보존
    const returnTo = pathname + (search || "");
    url.searchParams.set("returnTo", returnTo);
    return NextResponse.redirect(url);
  }

  // 2) 로그인 상태에서 public 페이지 접근 시 홈으로
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
  if (isLoggedIn && level !== 3 && isAdmin) {
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
