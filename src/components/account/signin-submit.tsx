"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { track } from "@/lib/analytics";

/** Submit button for sign-in forms that records `signup_started`. */
export function SignInSubmit({ provider, ...props }: ButtonProps & { provider: string }) {
  return <Button type="submit" {...props} onClick={() => track("signup_started", { provider })} />;
}
