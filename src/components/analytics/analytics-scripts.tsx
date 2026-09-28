import Script from "next/script";

/**
 * Loads the configured analytics provider. Choose one with
 * NEXT_PUBLIC_ANALYTICS_PROVIDER = plausible | posthog | ga4 | console | none.
 */
export function AnalyticsScripts() {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;

  if (provider === "plausible" && process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
    const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ?? "https://plausible.io/js/script.tagged-events.js";
    return (
      <>
        <Script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} src={src} strategy="afterInteractive" />
        <Script id="plausible-queue" strategy="afterInteractive">
          {`window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)}`}
        </Script>
      </>
    );
  }

  if (provider === "ga4" && process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(id)});`}
        </Script>
      </>
    );
  }

  if (provider === "posthog" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
    // Minimal loader: queues calls until PostHog's array.js arrives from the configured host.
    return (
      <Script id="posthog-init" strategy="afterInteractive">
        {`(function(){var q=[];window.posthog={capture:function(){q.push(arguments)}};var s=document.createElement('script');s.async=true;s.src=${JSON.stringify(host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js")};s.onload=function(){window.posthog.init(${JSON.stringify(process.env.NEXT_PUBLIC_POSTHOG_KEY)},{api_host:${JSON.stringify(host)},capture_pageview:true});q.forEach(function(a){window.posthog.capture.apply(window.posthog,a)})};document.head.appendChild(s)})();`}
      </Script>
    );
  }

  return null;
}
