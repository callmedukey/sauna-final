import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  // Handle /account route redirect
  if (request.nextUrl.pathname === "/account") {
    return NextResponse.redirect(new URL("/account/profile", request.url));
  }

  // Protect all routes under /account/
  if (request.nextUrl.pathname.startsWith("/account/")) {
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*"],
};
