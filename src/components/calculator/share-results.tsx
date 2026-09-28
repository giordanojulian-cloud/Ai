"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";

const noopSubscribe = () => () => {};

/**
 * Copy a link that reproduces the current inputs. Only calculator inputs are
 * encoded in the URL — never names, emails or account data.
 */
export function ShareResults({ slug, buildUrl, title }: { slug: string; buildUrl: () => string; title: string }) {
  const [copied, setCopied] = useState(false);
  // Server render and hydration assume no Web Share API; the client value applies after hydration.
  const canNativeShare = useSyncExternalStore(
    noopSubscribe,
    () => typeof navigator.share === "function",
    () => false,
  );

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    const url = buildUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers that block the async clipboard API.
      const input = document.createElement("textarea");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    track("calculator_shared", { slug, method: "copy_link" });
  };

  const share = async () => {
    try {
      await navigator.share({ title, url: buildUrl() });
      track("calculator_shared", { slug, method: "native_share" });
    } catch {
      // User dismissed the share sheet.
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={copy} aria-live="polite">
        {copied ? <Check aria-hidden /> : <Link2 aria-hidden />}
        {copied ? "Link copied" : "Copy link"}
      </Button>
      {canNativeShare && (
        <Button variant="outline" size="sm" onClick={share}>
          <Share2 aria-hidden />
          Share
        </Button>
      )}
    </>
  );
}
