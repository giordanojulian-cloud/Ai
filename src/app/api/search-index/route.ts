import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/catalog";
import { toSearchDoc } from "@/lib/search/docs";

export const revalidate = 3600;

/** Compact search index fetched lazily by the navbar search. */
export async function GET() {
  const catalog = await getCatalog();
  return NextResponse.json(catalog.map(toSearchDoc), {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
