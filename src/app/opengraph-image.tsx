import { siteConfig } from "@/config/site";
import { ogSize, renderOgImage } from "@/lib/seo/og-image";

export const size = ogSize;
export const contentType = "image/png";
export const alt = siteConfig.tagline;

export default function Image() {
  return renderOgImage({ title: siteConfig.tagline, subtitle: siteConfig.description });
}
