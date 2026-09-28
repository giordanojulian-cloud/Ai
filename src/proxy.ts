import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { features } from "@/lib/env";

/**
 * First line of defense for private areas: bounce anonymous visitors to sign
 * in. Pages and API routes still verify the session and role themselves.
 */
function toSignIn(url: URL) {
  const target = new URL("/signin", url.origin);
  target.searchParams.set("callbackUrl", url.pathname + url.search);
  return NextResponse.redirect(target);
}

const withAuth = auth((request) => (request.auth?.user ? NextResponse.next() : toSignIn(request.nextUrl)));

export function proxy(request: NextRequest, context: { params: Promise<Record<string, string>> }) {
  if (!features.authReady) return toSignIn(request.nextUrl);
  return withAuth(request, context);
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/account/:path*"],
};
