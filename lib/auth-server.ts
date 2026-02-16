import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { profile as profileTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { validateEnv } from "@/lib/env";

export async function getSession() {
  validateEnv();
  const h = await headers();
  const result = await auth.api.getSession({ headers: h });
  // Better Auth may return { data } or the session object directly depending on version
  const data = result && "data" in result ? (result as { data: { user: { id: string }; session: unknown } }).data : result;
  return data ?? null;
}

export type SessionWithUser = NonNullable<Awaited<ReturnType<typeof getSession>>>;

/** Get profile for current user (role, etc.). Returns null if no session or no profile. */
export async function getProfile(userId: string) {
  if (!db) return null;
  const rows = await db.select().from(profileTable).where(eq(profileTable.id, userId)).limit(1);
  return rows[0] ?? null;
}

/** Require session; redirect to login if not authenticated. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=" + encodeURIComponent("/account"));
  return session;
}

/** Require admin role; redirect if not admin. Call after requireSession or with session. */
export async function requireAdmin(session: SessionWithUser) {
  const p = await getProfile(session.user.id);
  if (!p || p.role !== "admin") redirect("/");
  return p;
}
