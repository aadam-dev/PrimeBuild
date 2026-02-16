import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user as userTable } from "@/lib/db/schema";

export async function getUserEmail(userId: string): Promise<string | null> {
  if (!db) return null;
  const rows = await db.select({ email: userTable.email }).from(userTable).where(eq(userTable.id, userId)).limit(1);
  return rows[0]?.email ?? null;
}
