"use server";

import { randomUUID } from "crypto";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, profile, account, suppliers } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { insertActivity } from "@/lib/db/queries/activity";
import { requireSession, requireAdmin } from "@/lib/auth-server";

async function requireAdminSession() {
  const session = await requireSession();
  await requireAdmin(session);
  return session;
}

export async function getAdminUsers() {
  await requireAdminSession();
  if (!db) return [];
  const rows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: profile.role,
      phone: profile.phone,
      createdAt: user.createdAt,
    })
    .from(user)
    .leftJoin(profile, eq(user.id, profile.id))
    .orderBy(desc(user.createdAt));
  return rows.map((r) => ({ ...r, orderCount: 0 }));
}

export async function updateUserRoleAction(userId: string, role: string) {
  const session = await requireAdminSession();
  if (!db) return { error: "Database unavailable" };

  if (!userId) return { error: "User ID required" };
  if (!["customer", "admin", "supplier"].includes(role)) {
    return { error: "Invalid role" };
  }

  const existing = await db.select().from(profile).where(eq(profile.id, userId)).limit(1);
  if (existing.length > 0) {
    await db.update(profile).set({ role, updatedAt: new Date() }).where(eq(profile.id, userId));
  } else {
    await db.insert(profile).values({ id: userId, role });
  }

  await insertActivity({ userId: session.user.id, action: "user_role_changed", entityType: "user", entityId: userId, metadata: { role } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export async function getAllSuppliersForLinking() {
  await requireAdminSession();
  if (!db) return [];
  return db.select({ id: suppliers.id, name: suppliers.name, userId: suppliers.userId }).from(suppliers).where(eq(suppliers.isActive, true));
}

export async function linkSupplierToUser(supplierId: string, userId: string) {
  const session = await requireAdminSession();
  if (!db) return { error: "Database unavailable" };

  if (!supplierId || !userId) return { error: "Supplier ID and User ID required" };

  await db.update(suppliers).set({ userId, updatedAt: new Date() }).where(eq(suppliers.id, supplierId));
  await insertActivity({ userId: session.user.id, action: "supplier_linked", entityType: "supplier", entityId: supplierId, metadata: { userId } });
  revalidatePath("/admin/users");
  return { ok: true };
}

export type CreateUserResult = { ok: true } | { ok: false; error: string };

/** Admin-only: create a new user with email/password and role. */
export async function createUserAction(formData: FormData): Promise<CreateUserResult> {
  await requireAdminSession();
  if (!db) return { ok: false, error: "Database unavailable." };

  const email = (formData.get("email") as string)?.trim()?.toLowerCase();
  const name = (formData.get("name") as string)?.trim();
  const password = (formData.get("password") as string);
  const role = (formData.get("role") as string)?.trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "A valid email is required." };
  if (!name || name.length < 1) return { ok: false, error: "Name is required." };
  if (!password || password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };
  if (!["customer", "admin", "supplier"].includes(role)) return { ok: false, error: "Invalid role." };

  let hashedPassword: string;
  try {
    const { hashPassword } = await import("better-auth/crypto");
    hashedPassword = await hashPassword(password);
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.error("createUserAction: hashPassword failed");
    }
    return { ok: false, error: "Failed to create account." };
  }

  const userId = randomUUID();
  const accountId = randomUUID();
  const now = new Date();

  try {
    await db.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });
  } catch (e: unknown) {
    const msg = e && typeof e === "object" && "code" in e && (e as { code: string }).code === "23505"
      ? "An account with this email already exists."
      : "Failed to create account.";
    return { ok: false, error: msg };
  }

  await db.insert(account).values({
    id: accountId,
    userId,
    accountId: userId,
    providerId: "credential",
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  });

  await db.insert(profile).values({
    id: userId,
    fullName: name,
    role,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/admin/users");
  return { ok: true };
}
