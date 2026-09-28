import { getCategory } from "@/calculators/categories";
import { calculatorMetas, findCalculator } from "@/calculators/registry";
import { ogSize, renderOgImage } from "@/lib/seo/og-image";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Calculator preview";

export function generateStaticParams() {
  return calculatorMetas.map((meta) => ({ slug: meta.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meta = findCalculator(calculatorMetas, slug);
  return renderOgImage({
    eyebrow: meta ? getCategory(meta.category)?.name : undefined,
    title: meta?.name ?? "Calculator",
    subtitle: meta?.shortDescription,
  });
}
