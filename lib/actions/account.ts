"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { user as userTable, profile as profileTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth-server";

export type UpdateProfileResult = { ok: true } | { ok: false; error: string };

/** Update current user's profile (fullName, phone) and user.name. Session required. */
export async function updateProfileAction(formData: FormData): Promise<UpdateProfileResult> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in." };

  const fullName = (formData.get("fullName") as string)?.trim() ?? "";
  const phone = (formData.get("phone") as string)?.trim() || null;

  if (!db) return { ok: false, error: "Database unavailable." };

  const userId = session.user.id;

  try {
    await db.update(userTable).set({ name: fullName || ((session.user as { name?: string }).name ?? "User"), updatedAt: new Date() }).where(eq(userTable.id, userId));
    const existing = await db.select().from(profileTable).where(eq(profileTable.id, userId)).limit(1);
    if (existing[0]) {
      await db.update(profileTable).set({ fullName: fullName || null, phone, updatedAt: new Date() }).where(eq(profileTable.id, userId));
    } else {
      await db.insert(profileTable).values({ id: userId, fullName: fullName || null, phone });
    }
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.error("updateProfileAction: update failed");
    }
    return { ok: false, error: "Failed to update profile." };
  }

  revalidatePath("/account", "layout");
  revalidatePath("/account/settings");
  return { ok: true };
}
