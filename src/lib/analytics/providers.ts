import type { AnalyticsProps } from "./events";

export interface AnalyticsProvider {
  name: string;
  track(event: string, props: AnalyticsProps): void;
}

type WindowWithAnalytics = Window & {
  plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
  posthog?: { capture: (event: string, props?: AnalyticsProps) => void };
  gtag?: (command: "event", event: string, props?: AnalyticsProps) => void;
};

function w(): WindowWithAnalytics | undefined {
  return typeof window === "undefined" ? undefined : (window as WindowWithAnalytics);
}

export const plausibleProvider: AnalyticsProvider = {
  name: "plausible",
  track: (event, props) => w()?.plausible?.(event, { props }),
};

export const posthogProvider: AnalyticsProvider = {
  name: "posthog",
  track: (event, props) => w()?.posthog?.capture(event, props),
};

export const ga4Provider: AnalyticsProvider = {
  name: "ga4",
  track: (event, props) => w()?.gtag?.("event", event, props),
};

export const consoleProvider: AnalyticsProvider = {
  name: "console",
  track: (event, props) => console.info("[analytics]", event, props),
};

export const noopProvider: AnalyticsProvider = { name: "none", track: () => {} };

export type AnalyticsProviderName = "plausible" | "posthog" | "ga4" | "console" | "none";

export function resolveProvider(name: string | undefined): AnalyticsProvider {
  switch (name) {
    case "plausible":
      return plausibleProvider;
    case "posthog":
      return posthogProvider;
    case "ga4":
      return ga4Provider;
    case "console":
      return consoleProvider;
    default:
      return noopProvider;
  }
}
