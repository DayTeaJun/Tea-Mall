import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./lib/config/supabase/middleware";

const protectedRoutes = ["/profile"];
const publicRoutes = ["/signin", "/signup"];

export async function middleware(request: NextRequest) {
  const { response, isLoggedIn } = await updateSession(request);

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
