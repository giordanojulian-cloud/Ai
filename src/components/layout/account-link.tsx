"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";

/**
 * Resolves the session client-side so every public page can stay statically
 * rendered (reading cookies in the layout would make the whole site dynamic).
 */
export function AccountLink({ className }: { className?: string }) {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((response) => (response.ok ? response.json() : null))
      .then((session: { user?: unknown } | null) => active && setSignedIn(Boolean(session?.user)))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return signedIn ? (
    <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "sm", className })}>
      Dashboard
    </Link>
  ) : (
    <Link href="/signin" className={buttonVariants({ variant: "primary", size: "sm", className })}>
      Sign in
    </Link>
  );
}
