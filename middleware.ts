import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Handle /account route redirect
  if (request.nextUrl.pathname === "/account") {
    return NextResponse.redirect(new URL("/account/profile", request.url));
  }

  // Protect all routes under /account/

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
