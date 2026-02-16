"use server";

import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { insertActivity } from "@/lib/db/queries/activity";
import { requireSession, requireAdmin } from "@/lib/auth-server";

async function requireAdminSession() {
  const session = await requireSession();
  await requireAdmin(session);
  return session;
}

export async function getAllProductsAdmin() {
  await requireAdminSession();
  if (!db) return [];
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getAllCategoriesForProducts() {
  await requireAdminSession();
  if (!db) return [];
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function createProductAction(formData: FormData) {
  const session = await requireAdminSession();
  if (!db) return { error: "Database unavailable" };

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const sku = formData.get("sku")?.toString().trim() || null;
  const categoryId = formData.get("categoryId")?.toString();
  const price = formData.get("price")?.toString();
  const compareAtPrice = formData.get("compareAtPrice")?.toString() || null;
  const unit = formData.get("unit")?.toString() || "piece";
  const description = formData.get("description")?.toString() || null;
  const stockQuantity = formData.get("stockQuantity")?.toString();

  if (!name || !slug || !categoryId || !price) {
    return { error: "Name, slug, category, and price are required" };
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum < 0) {
    return { error: "Price must be a positive number" };
  }

  await db.insert(products).values({
    name,
    slug,
    sku,
    categoryId,
    price,
    compareAtPrice,
    unit,
    description,
    shortDescription: description ? description.split(".")[0] + "." : null,
    stockQuantity: stockQuantity ? parseInt(stockQuantity) : null,
    images: [],
    isActive: true,
  });

  await insertActivity({ userId: session.user.id, action: "product_created", entityType: "product", metadata: { name } });
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function updateProductAction(formData: FormData) {
  const session = await requireAdminSession();
  if (!db) return { error: "Database unavailable" };

  const id = formData.get("id")?.toString();
  if (!id) return { error: "Product ID required" };

  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const sku = formData.get("sku")?.toString().trim() || null;
  const categoryId = formData.get("categoryId")?.toString();
  const price = formData.get("price")?.toString();
  const compareAtPrice = formData.get("compareAtPrice")?.toString() || null;
  const unit = formData.get("unit")?.toString() || "piece";
  const description = formData.get("description")?.toString() || null;
  const stockQuantity = formData.get("stockQuantity")?.toString();

  if (!name || !slug || !categoryId || !price) {
    return { error: "Name, slug, category, and price are required" };
  }

  const priceNum = parseFloat(price);
  if (isNaN(priceNum) || priceNum < 0) {
    return { error: "Price must be a positive number" };
  }

  await db.update(products).set({
    name,
    slug,
    sku,
    categoryId,
    price,
    compareAtPrice: compareAtPrice || null,
    unit,
    description,
    shortDescription: description ? description.split(".")[0] + "." : null,
    stockQuantity: stockQuantity ? parseInt(stockQuantity) : null,
    updatedAt: new Date(),
  }).where(eq(products.id, id));

  await insertActivity({ userId: session.user.id, action: "product_updated", entityType: "product", entityId: id, metadata: { name } });
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function toggleProductActiveAction(productId: string, isActive: boolean) {
  const session = await requireAdminSession();
  if (!db) return { error: "Database unavailable" };
  await db.update(products).set({ isActive, updatedAt: new Date() }).where(eq(products.id, productId));
  await insertActivity({ userId: session.user.id, action: isActive ? "product_activated" : "product_deactivated", entityType: "product", entityId: productId });
  revalidatePath("/admin/products");
  return { ok: true };
}
