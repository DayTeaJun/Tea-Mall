import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/config/supabase/server/middleware";

const protectedRoutes = ["/profile", "myCart"];
const publicRoutes = ["/signin", "/signup"];
const adminRoutes = ["/admin"];
const sellerRoutes = ["/productRegist"];

export async function middleware(request: NextRequest) {
  const { response, isLoggedIn, level } = await updateSession(request);

  const { pathname } = request.nextUrl;

  // 비로그인 상태인데 protected 경로 접근
  if (!isLoggedIn && protectedRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // 로그인 상태인데 public 경로 접근
  if (isLoggedIn && publicRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (level < 2 && sellerRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    // url.searchParams.set("notice", "seller_only");
    return NextResponse.redirect(url);
  }

  if (level !== 3 && adminRoutes.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    // url.searchParams.set("notice", "admin_only");
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
