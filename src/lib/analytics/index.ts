import type { AnalyticsEventName, AnalyticsEvents, AnalyticsProps } from "./events";
import { resolveProvider, type AnalyticsProvider } from "./providers";

export type { AnalyticsEventName, AnalyticsEvents } from "./events";

let provider: AnalyticsProvider = resolveProvider(process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER);

/** Swap the provider at runtime (tests, consent managers). */
export function setAnalyticsProvider(next: AnalyticsProvider): void {
  provider = next;
}

/**
 * Track a product event. Safe to call anywhere on the client; never throws.
 * Do not pass personal data or raw financial inputs as properties.
 */
export function track<E extends AnalyticsEventName>(event: E, props: AnalyticsEvents[E]): void {
  try {
    provider.track(event, props as AnalyticsProps);
  } catch {
    // Analytics must never break the product.
  }
}
