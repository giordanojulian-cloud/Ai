/**
 * Server-side feature flags derived from environment variables. Every
 * integration is optional: the site must build and run with none of them.
 * Never import this into client components (it reads private variables).
 */
function has(...names: string[]): boolean {
  return names.every((name) => Boolean(process.env[name]?.trim()));
}

export const features = {
  get database() {
    return has("DATABASE_URL");
  },
  get githubAuth() {
    return has("AUTH_GITHUB_ID", "AUTH_GITHUB_SECRET");
  },
  get googleAuth() {
    return has("AUTH_GOOGLE_ID", "AUTH_GOOGLE_SECRET");
  },
  get emailAuth() {
    return has("AUTH_RESEND_KEY", "AUTH_EMAIL_FROM") && has("DATABASE_URL");
  },
  /** Password-less local sign-in for development only. */
  get devAuth() {
    return process.env.NODE_ENV !== "production" && process.env.AUTH_DEV_LOGIN === "true";
  },
  get auth() {
    return this.githubAuth || this.googleAuth || this.emailAuth || this.devAuth;
  },
  get stripe() {
    return has("STRIPE_SECRET_KEY", "STRIPE_PRICE_PRO_MONTHLY", "STRIPE_PRICE_PRO_ANNUAL") && has("DATABASE_URL");
  },
  get ai() {
    return has("ANTHROPIC_API_KEY");
  },
};

/** Comma-separated list of emails that are granted the ADMIN role on sign-in. */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}
