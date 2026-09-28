import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { adminEmails, features } from "@/lib/env";

/**
 * Auth.js configuration. Providers are enabled only when their environment
 * variables exist, so the site runs with zero auth configuration. Sessions use
 * JWTs (no DB read per request); the Prisma adapter persists users/accounts.
 */

function isAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email && adminEmails().includes(email.toLowerCase()));
}

function buildProviders(): Provider[] {
  const providers: Provider[] = [];
  if (features.githubAuth) providers.push(GitHub);
  if (features.googleAuth) providers.push(Google);
  if (features.emailAuth) providers.push(Resend({ from: process.env.AUTH_EMAIL_FROM }));
  if (features.devAuth) {
    providers.push(
      Credentials({
        id: "dev",
        name: "Development login",
        credentials: { email: { label: "Email", type: "email" } },
        // Development only: signs in any email without a password. Never enabled in production.
        async authorize(raw) {
          const parsed = z.object({ email: z.email() }).safeParse(raw);
          if (!parsed.success) return null;
          const email = parsed.data.email.toLowerCase();
          if (!features.database) return { id: `dev:${email}`, email, name: email.split("@")[0], role: isAdminEmail(email) ? "ADMIN" : "USER" };
          const user = await getDb().user.upsert({
            where: { email },
            update: {},
            create: { email, name: email.split("@")[0], role: isAdminEmail(email) ? "ADMIN" : "USER" },
          });
          return { id: user.id, email: user.email, name: user.name, role: user.role };
        },
      }),
    );
  }
  return providers;
}

export const configuredProviders = () =>
  buildProviders().map((p) => {
    const provider = typeof p === "function" ? p() : p;
    return { id: provider.id, name: provider.name, type: provider.type };
  });

const config: NextAuthConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- adapter is typed against the legacy @prisma/client export
  adapter: features.database ? PrismaAdapter(getDb() as any) : undefined,
  providers: buildProviders(),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? (process.env.NODE_ENV !== "production" ? "development-only-insecure-secret" : undefined),
  trustHost: true,
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = isAdminEmail(user.email) ? "ADMIN" : (user.role ?? "USER");
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id;
      session.user.role = token.role ?? "USER";
      return session;
    },
  },
  events: {
    // Promote bootstrap admins (ADMIN_EMAILS) in the database on first sign-in.
    async signIn({ user }) {
      if (features.database && user.id && isAdminEmail(user.email) && user.role !== "ADMIN") {
        await getDb().user.update({ where: { id: user.id }, data: { role: "ADMIN" } }).catch(() => {});
      }
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
