import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/auth";
import { getDb } from "@/lib/db";
import { adminEmails, features } from "@/lib/env";

export interface CurrentUser {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role: "USER" | "ADMIN";
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return { ...session.user, role: session.user.role ?? "USER" };
});

/** For pages: redirects anonymous visitors to sign in and back. */
export async function requireUser(callbackUrl: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  return user;
}

/**
 * Admin check against the database (not just the JWT), so revoking a role
 * takes effect immediately. Non-admins get a 404 to avoid revealing the route.
 */
export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (await isAdmin(user)) return user;
  notFound();
}

export async function isAdmin(user: CurrentUser): Promise<boolean> {
  if (user.email && adminEmails().includes(user.email.toLowerCase())) return true;
  if (!features.database) return false;
  const record = await getDb().user.findUnique({ where: { id: user.id }, select: { role: true } });
  return record?.role === "ADMIN";
}
