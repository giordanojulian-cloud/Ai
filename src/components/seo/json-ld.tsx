import type { JsonLd as JsonLdData } from "@/lib/seo/jsonld";

/** Serializes structured data safely (escapes "<" so content can't close the script tag). */
export function JsonLd({ data }: { data: JsonLdData | null | (JsonLdData | null)[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter((item): item is JsonLdData => item !== null);
  if (!items.length) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(/</g, "\\u003c") }}
    />
  );
}
