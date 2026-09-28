/**
 * Brand configuration. Renaming the product only requires changing this file
 * (plus public/ assets). Never hardcode the brand name elsewhere.
 */
export const siteConfig = {
  name: "CalcForge",
  legalName: "CalcForge",
  tagline: "Calculate Anything. Understand Everything.",
  description:
    "Fast, accurate calculators for money, business, real estate, construction and everyday decisions.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_US",
  contactEmail: "hello@calcforge.example",
  twitterHandle: undefined as string | undefined,
  /** Two-letter mark rendered in the logo square. */
  logoMark: "CF",
} as const;

export function absoluteUrl(path = "/"): string {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
