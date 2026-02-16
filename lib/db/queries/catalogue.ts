import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, products } from "@/lib/db/schema";
import type { Category, Product } from "@/lib/database.types";

function mapCategory(row: typeof categories.$inferSelect): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    image_url: row.imageUrl,
    sort_order: row.sortOrder,
    is_active: row.isActive,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

function mapProduct(row: typeof products.$inferSelect): Product {
  return {
    id: row.id,
    category_id: row.categoryId,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    description: row.description,
    short_description: row.shortDescription,
    unit: row.unit,
    price: Number(row.price),
    compare_at_price: row.compareAtPrice != null ? Number(row.compareAtPrice) : null,
    images: row.images,
    is_active: row.isActive,
    created_at: row.createdAt.toISOString(),
    updated_at: row.updatedAt.toISOString(),
  };
}

export async function getCategoriesFromDb(): Promise<Category[]> {
  if (!db) return [];
  const rows = await db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(categories.sortOrder);
  return rows.map(mapCategory);
}

export async function getCategoryBySlugFromDb(slug: string): Promise<Category | null> {
  if (!db) return null;
  const rows = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);
  const row = rows[0];
  return row ? mapCategory(row) : null;
}

export async function getProductsFromDb(categorySlug?: string): Promise<Product[]> {
  if (!db) return [];
  if (categorySlug) {
    const cat = await getCategoryBySlugFromDb(categorySlug);
    if (!cat) return [];
    const rows = await db
      .select()
      .from(products)
      .where(and(eq(products.categoryId, cat.id), eq(products.isActive, true)));
    return rows.map(mapProduct);
  }
  const rows = await db.select().from(products).where(eq(products.isActive, true));
  return rows.map(mapProduct);
}

export async function getProductBySlugFromDb(slug: string): Promise<Product | null> {
  if (!db) return null;
  const rows = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  const row = rows[0];
  return row ? mapProduct(row) : null;
}

export async function getProductByIdFromDb(id: string): Promise<Product | null> {
  if (!db) return null;
  const rows = await db.select().from(products).where(eq(products.id, id)).limit(1);
  const row = rows[0];
  return row ? mapProduct(row) : null;
}
