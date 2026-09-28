import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * First line of defense for private areas: bounce anonymous visitors to sign
 * in. Pages and API routes still verify the session and role themselves.
 */
export const proxy = auth((request) => {
  if (!request.auth?.user) {
    const url = new URL("/signin", request.nextUrl.origin);
    url.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/account/:path*"],
};
