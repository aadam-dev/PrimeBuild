import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function requireAdminApi(): Promise<
  { user: { id: string; name: string; email: string }; error?: never } |
  { error: NextResponse; user?: never }
> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!db) {
    return { error: NextResponse.json({ error: "Database unavailable" }, { status: 500 }) };
  }
  const [p] = await db.select({ role: profile.role }).from(profile).where(eq(profile.id, session.user.id)).limit(1);
  if (!p || p.role !== "admin") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user: { id: session.user.id, name: session.user.name ?? "", email: session.user.email ?? "" } };
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(str: string): boolean {
  return UUID_REGEX.test(str);
}

const VALID_ORDER_STATUSES = ["confirmed", "with_supplier", "dispatched", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof VALID_ORDER_STATUSES)[number];

export function isValidOrderStatus(s: string): s is OrderStatus {
  return (VALID_ORDER_STATUSES as readonly string[]).includes(s);
}

const ORDER_TRANSITIONS: Record<string, string[]> = {
  confirmed: ["with_supplier", "cancelled"],
  with_supplier: ["dispatched", "cancelled"],
  dispatched: ["delivered"],
  delivered: [],
  cancelled: [],
};

export function isValidOrderTransition(from: string, to: string): boolean {
  return ORDER_TRANSITIONS[from]?.includes(to) ?? false;
}
