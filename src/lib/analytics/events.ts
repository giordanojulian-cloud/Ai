/** Every product event, with its allowed properties. Add new events here first. */
export interface AnalyticsEvents {
  calculator_view: { slug: string };
  calculator_started: { slug: string };
  calculator_completed: { slug: string };
  calculator_shared: { slug: string; method: "copy_link" | "native_share" };
  calculator_saved: { slug: string };
  affiliate_clicked: { vertical: string; partner: string; slug?: string };
  signup_started: { provider: string };
  /** TODO(analytics): fire from an Auth.js `createUser` event once server-side analytics is configured. */
  signup_completed: { provider?: string };
  premium_clicked: { plan: string; location: string };
  search_performed: { query: string; results: number; location: "navbar" | "page" | "home" };
  calculator_suggestion_submitted: Record<string, never>;
  feedback_submitted: { slug: string; helpful: boolean };
  newsletter_subscribed: { location: string };
  ai_explain_requested: { slug: string };
  table_exported: { slug: string; table: string };
}

export type AnalyticsEventName = keyof AnalyticsEvents;
export type AnalyticsProps = Record<string, string | number | boolean>;
