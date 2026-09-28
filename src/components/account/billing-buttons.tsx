"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { postJson } from "@/lib/api-client";

function useRedirectAction(url: string, body: unknown) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const run = async () => {
    setPending(true);
    setError("");
    const result = await postJson<{ url: string }>(url, body);
    if (result.ok) {
      // External Stripe-hosted page.
      window.location.assign(result.data.url);
      return;
    }
    if (result.status === 401) {
      router.push(`/signin?callbackUrl=${encodeURIComponent("/pricing")}`);
      return;
    }
    setError(result.error);
    setPending(false);
  };
  return { pending, error, run };
}

export function UpgradeButton({ plan, children, ...props }: ButtonProps & { plan: "pro_monthly" | "pro_annual" }) {
  const { pending, error, run } = useRedirectAction("/api/billing/checkout", { plan });
  return (
    <div className="flex flex-col gap-2">
      <Button
        {...props}
        disabled={pending || props.disabled}
        onClick={() => {
          track("premium_clicked", { plan, location: "pricing" });
          void run();
        }}
      >
        {pending ? "Redirecting…" : children}
      </Button>
      {error && <p className="text-xs text-negative">{error}</p>}
    </div>
  );
}

export function ManageBillingButton() {
  const { pending, error, run } = useRedirectAction("/api/billing/portal", {});
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline" onClick={() => void run()} disabled={pending}>
        {pending ? "Opening…" : "Manage billing"}
      </Button>
      {error && <p className="text-xs text-negative">{error}</p>}
    </div>
  );
}
