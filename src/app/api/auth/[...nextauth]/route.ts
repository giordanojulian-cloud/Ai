import { NextResponse, type NextRequest } from "next/server";
import { handlers } from "@/auth";
import { features } from "@/lib/env";

/** Without AUTH_SECRET in production, report "signed out" instead of erroring. */
function disabled(request: NextRequest) {
  if (request.nextUrl.pathname.endsWith("/session")) return NextResponse.json(null);
  return NextResponse.json({ error: "Authentication is not configured." }, { status: 503 });
}

export const GET = (request: NextRequest) => (features.authReady ? handlers.GET(request) : disabled(request));
export const POST = (request: NextRequest) => (features.authReady ? handlers.POST(request) : disabled(request));
