import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin", "/account", "/dashboard", "/signin", "/search"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
