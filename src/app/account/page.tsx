import type { Metadata } from "next";
import Link from "next/link";
import { signOut } from "@/auth";
import { ManageBillingButton } from "@/components/account/billing-buttons";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { requireUser } from "@/lib/auth/session";
import { getEntitlements } from "@/lib/billing/entitlements";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ title: "Account", description: "Manage your account.", path: "/account", noIndex: true });

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const user = await requireUser("/account");
  const entitlements = await getEntitlements(user.id).catch(() => null);
  const checkout = (await searchParams).checkout;

  return (
    <Container className="max-w-2xl py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      {checkout === "success" && (
        <Alert variant="success" className="mt-6">
          Thanks for upgrading! It can take a few seconds for Pro to activate.
        </Alert>
      )}
      <div className="mt-8 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="font-medium">{user.name ?? "—"}</p>
            <p className="text-muted-foreground">{user.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Plan <Badge variant={entitlements?.tier === "PRO" ? "primary" : "default"}>{entitlements?.tier === "PRO" ? "Pro" : "Free"}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-3 text-sm">
            {entitlements?.subscription?.currentPeriodEnd && (
              <p className="text-muted-foreground">
                {entitlements.subscription.cancelAtPeriodEnd ? "Ends" : "Renews"} on {entitlements.subscription.currentPeriodEnd.toLocaleDateString("en-US", { dateStyle: "long" })}
              </p>
            )}
            {entitlements?.subscription ? (
              <ManageBillingButton />
            ) : (
              <Link href="/pricing" className={buttonVariants({ variant: "outline" })}>
                See Pro plans
              </Link>
            )}
          </CardContent>
        </Card>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button type="submit" variant="ghost">
            Sign out
          </Button>
        </form>
      </div>
    </Container>
  );
}
