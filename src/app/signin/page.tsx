import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { configuredProviders, signIn } from "@/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";
import { getCurrentUser } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({ title: "Sign in", description: `Sign in to ${siteConfig.name}.`, path: "/signin", noIndex: true });

/** Only allow same-site relative redirects after sign-in (prevents open redirects). */
function safeCallback(value: string | string[] | undefined): string {
  const url = Array.isArray(value) ? value[0] : value;
  return url && url.startsWith("/") && !url.startsWith("//") ? url : "/dashboard";
}

export default async function SignInPage({ searchParams }: PageProps<"/signin">) {
  const params = await searchParams;
  const callbackUrl = safeCallback(params.callbackUrl);
  if (await getCurrentUser()) redirect(callbackUrl);
  const providers = configuredProviders();
  const oauth = providers.filter((p) => p.type === "oauth" || p.type === "oidc");
  const email = providers.find((p) => p.type === "email");
  const dev = providers.find((p) => p.id === "dev");

  return (
    <Container className="flex max-w-sm flex-col py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Sign in to {siteConfig.name}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Save calculations and access them from any device.</p>
      {params.error && (
        <Alert variant="error" className="mt-6">
          Sign-in failed. Please try again.
        </Alert>
      )}
      <div className="mt-8 flex flex-col gap-3">
        {oauth.map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server";
              await signIn(provider.id, { redirectTo: callbackUrl });
            }}
          >
            <Button type="submit" variant="outline" className="w-full">
              Continue with {provider.name}
            </Button>
          </form>
        ))}
        {email && (
          <form
            className="flex flex-col gap-2"
            action={async (formData) => {
              "use server";
              await signIn(email.id, { email: String(formData.get("email") ?? ""), redirectTo: callbackUrl });
            }}
          >
            <Label htmlFor="signin-email">Email</Label>
            <Input id="signin-email" name="email" type="email" required autoComplete="email" />
            <Button type="submit">Email me a sign-in link</Button>
          </form>
        )}
        {dev && (
          <form
            className="flex flex-col gap-2 rounded-lg border border-dashed border-warning/50 p-4"
            action={async (formData) => {
              "use server";
              await signIn("dev", { email: String(formData.get("email") ?? ""), redirectTo: callbackUrl });
            }}
          >
            <Label htmlFor="dev-email">Development login</Label>
            <p className="text-xs text-muted-foreground">Local development only. Signs in any email without a password.</p>
            <Input id="dev-email" name="email" type="email" required defaultValue="dev@example.com" />
            <Button type="submit" variant="secondary">
              Sign in (dev)
            </Button>
          </form>
        )}
        {providers.length === 0 && (
          <Alert>
            Sign-in isn’t configured yet. Set GitHub, Google or email credentials (or <code>AUTH_DEV_LOGIN=true</code> locally) — see the README.
          </Alert>
        )}
      </div>
    </Container>
  );
}
