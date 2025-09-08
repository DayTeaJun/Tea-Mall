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

export async function middleware(request: NextRequest) {
  const { response, isLoggedIn, level } = await updateSession(request);

  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isSellerRoute = sellerRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  if (!isLoggedIn && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  if (isLoggedIn && isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (level < 2 && isSellerRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/not-found";
    return NextResponse.redirect(url);
  }

  if (level !== 3 && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/not-found";
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
