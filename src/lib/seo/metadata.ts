import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

interface PageMetadataInput {
  title: string;
  description: string;
  /** Path beginning with "/". Used for the canonical URL. */
  path: string;
  /** Use the title verbatim (skip the " | Brand" template). */
  absoluteTitle?: boolean;
  noIndex?: boolean;
  keywords?: string[];
}

/**
 * Consistent metadata for every page: canonical URL (query strings are never
 * canonical, so shared calculator links don't create duplicates), Open Graph
 * and Twitter cards.
 */
export function buildMetadata({ title, description, path, absoluteTitle, noIndex, keywords }: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(siteConfig.twitterHandle ? { site: siteConfig.twitterHandle } : {}),
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}
