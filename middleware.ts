import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Handle /account route redirect
  if (request.nextUrl.pathname === "/account") {
    return NextResponse.redirect(new URL("/account/profile", request.url));
  }
  if (request.nextUrl.pathname === "/community") {
    return NextResponse.redirect(new URL("/community/notice", request.url));
  }

  // Handle /admin route redirect
  if (request.nextUrl.pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/reservations", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/admin", "/community"],
};
