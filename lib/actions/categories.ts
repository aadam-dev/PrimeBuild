"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { insertActivity } from "@/lib/db/queries/activity";
import { requireSession, requireAdmin } from "@/lib/auth-server";

async function requireAdminSession() {
  const session = await requireSession();
  await requireAdmin(session);
  return session;
}

export async function getAllCategoriesAdmin() {
  await requireAdminSession();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function createCategoryAction(formData: FormData) {
  const session = await requireAdminSession();
  if (!db) return { error: "Database unavailable" };

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0");

  if (!name || !slug) return { error: "Name and slug are required" };
  if (isNaN(sortOrder)) return { error: "Sort order must be a number" };

  await db.insert(categories).values({
    name,
    slug,
    description,
    sortOrder,
    isActive: true,
  });

  await insertActivity({ userId: session.user.id, action: "category_created", entityType: "category", metadata: { name } });
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function updateCategoryAction(formData: FormData) {
  const session = await requireAdminSession();
  if (!db) return { error: "Database unavailable" };

  const id = formData.get("id")?.toString();
  if (!id) return { error: "Category ID required" };

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrder = parseInt(formData.get("sortOrder")?.toString() || "0");

  if (!name || !slug) return { error: "Name and slug are required" };

  await db.update(categories).set({
    name,
    slug,
    description,
    sortOrder,
    updatedAt: new Date(),
  }).where(eq(categories.id, id));

  await insertActivity({ userId: session.user.id, action: "category_updated", entityType: "category", entityId: id, metadata: { name } });
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function toggleCategoryActiveAction(categoryId: string, isActive: boolean) {
  const session = await requireAdminSession();
  if (!db) return { error: "Database unavailable" };
  await db.update(categories).set({ isActive, updatedAt: new Date() }).where(eq(categories.id, categoryId));
  await insertActivity({ userId: session.user.id, action: isActive ? "category_activated" : "category_deactivated", entityType: "category", entityId: categoryId });
  revalidatePath("/admin/categories");
  return { ok: true };
}
