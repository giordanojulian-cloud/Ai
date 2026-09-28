import Script from "next/script";
import { adsConfig } from "@/config/monetization";

/** Ad network loader. Only AdSense is wired; other networks add their script here. */
export function AdScripts() {
  if (adsConfig.mode !== "adsense" || !adsConfig.adsenseClient) return null;
  return (
    <Script
      async
      strategy="lazyOnload"
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.adsenseClient}`}
    />
  );
}
