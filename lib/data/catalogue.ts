import { isDbConfigured } from "@/lib/db";
import {
  getCategoriesFromDb,
  getCategoryBySlugFromDb,
  getProductsFromDb,
  getProductBySlugFromDb,
  getProductByIdFromDb,
} from "@/lib/db/queries/catalogue";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import type { Category, Product } from "@/lib/database.types";

/** Fetch all active categories. Uses DB when configured, else mock. */
export async function getCategories(): Promise<Category[]> {
  if (isDbConfigured()) return getCategoriesFromDb();
  return mockCategories.filter((c) => c.is_active);
}

/** Fetch category by slug. */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (isDbConfigured()) return getCategoryBySlugFromDb(slug);
  return mockCategories.find((c) => c.slug === slug && c.is_active) ?? null;
}

/** Fetch all active products, optionally by category slug. */
export async function getProducts(categorySlug?: string): Promise<Product[]> {
  if (isDbConfigured()) return getProductsFromDb(categorySlug);
  let list = mockProducts.filter((p) => p.is_active);
  if (categorySlug) {
    const cat = mockCategories.find((c) => c.slug === categorySlug);
    if (cat) list = list.filter((p) => p.category_id === cat.id);
  }
  return list;
}

/** Fetch single product by slug. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isDbConfigured()) return getProductBySlugFromDb(slug);
  return mockProducts.find((p) => p.slug === slug && p.is_active) ?? null;
}

/** Fetch single product by id. */
export async function getProductById(id: string): Promise<Product | null> {
  if (isDbConfigured()) return getProductByIdFromDb(id);
  return mockProducts.find((p) => p.id === id && p.is_active) ?? null;
}

/** Search products by name or category. */
export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase().trim();
  if (!q) return getProducts();
  return mockProducts.filter(
    (p) =>
      p.is_active &&
      (p.name.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        mockCategories.some(
          (c) => c.id === p.category_id && c.name.toLowerCase().includes(q)
        ))
  );
}
