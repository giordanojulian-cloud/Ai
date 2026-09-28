import type { Metadata } from "next";
import { ProsePage } from "@/components/layout/prose-page";
import { siteConfig } from "@/config/site";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects information.`,
  path: "/privacy",
});

// TODO(legal): Have counsel review before launch and add jurisdiction-specific sections (e.g. CCPA/GDPR) as needed.
export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy policy" updated="September 28, 2026">
      <h2>Calculator inputs</h2>
      <p>
        Calculations run in your browser. We do not store the numbers you type into calculators unless you choose to save a calculation
        to your account. Shareable links contain calculator inputs in the URL, so only share them with people you trust.
      </p>
      <h2>Information you provide</h2>
      <ul>
        <li>Account details (name, email) when you sign in.</li>
        <li>Saved calculations you explicitly save to your dashboard. You can delete them at any time.</li>
        <li>Your email address if you subscribe to our newsletter.</li>
        <li>Feedback and calculator suggestions, including an optional email address.</li>
      </ul>
      <h2>Analytics</h2>
      <p>
        We use privacy-focused analytics to understand which calculators are used and whether they work well. Analytics events never
        include the values you enter into calculators.
      </p>
      <h2>Advertising and affiliates</h2>
      <p>
        Some pages may display advertising or links to partners. Ad partners may use cookies subject to their own policies. Where required,
        we will ask for consent before loading them.
      </p>
      <h2>Your choices</h2>
      <p>
        You can delete saved calculations from your dashboard, unsubscribe from emails with one click, and contact us at{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> to request deletion of your account.
      </p>
    </ProsePage>
  );
}
