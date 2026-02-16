import { desc, eq, sql, and, gte, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, proformas, products, categories, user, profile } from "@/lib/db/schema";

export async function getRevenueByPeriod(days = 30) {
  if (!db) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  return db
    .select({
      date: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
      revenue: sql<number>`COALESCE(sum(${orders.total}), 0)::float`,
      count: sql<number>`count(*)::int`,
    })
    .from(orders)
    .where(gte(orders.createdAt, since))
    .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`);
}

export async function getOrdersByStatus() {
  if (!db) return [];
  return db
    .select({
      status: orders.status,
      count: sql<number>`count(*)::int`,
    })
    .from(orders)
    .groupBy(orders.status);
}

export async function getProformaConversionFunnel() {
  if (!db) return { total: 0, pending: 0, approved: 0, converted: 0, declined: 0, expired: 0 };
  const rows = await db
    .select({
      status: proformas.status,
      count: sql<number>`count(*)::int`,
    })
    .from(proformas)
    .groupBy(proformas.status);
  const map: Record<string, number> = {};
  rows.forEach((r) => { map[r.status] = r.count; });
  return {
    total: rows.reduce((s, r) => s + r.count, 0),
    pending: map["pending"] ?? 0,
    approved: map["approved"] ?? 0,
    converted: map["converted"] ?? 0,
    declined: map["declined"] ?? 0,
    expired: map["expired"] ?? 0,
  };
}

export async function getTopProductsByRevenue(limit = 10) {
  if (!db) return [];
  return db
    .select({
      productName: orderItems.productName,
      totalRevenue: sql<number>`sum(${orderItems.lineTotal})::float`,
      totalQuantity: sql<number>`sum(${orderItems.quantity})::int`,
    })
    .from(orderItems)
    .groupBy(orderItems.productName)
    .orderBy(desc(sql`sum(${orderItems.lineTotal})`))
    .limit(limit);
}

export async function getTopCategoriesByVolume(limit = 10) {
  if (!db) return [];
  return db
    .select({
      categoryName: categories.name,
      totalOrdered: sql<number>`sum(${orderItems.quantity})::int`,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .groupBy(categories.name)
    .orderBy(desc(sql`sum(${orderItems.quantity})`))
    .limit(limit);
}

export async function getCustomerCount() {
  if (!db) return 0;
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(profile)
    .where(eq(profile.role, "customer"));
  return row?.count ?? 0;
}

export async function getRevenueStats() {
  if (!db) return { today: 0, thisWeek: 0, thisMonth: 0, total: 0 };
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [row] = await db
    .select({
      total: sql<number>`COALESCE(sum(${orders.total}), 0)::float`,
      today: sql<number>`COALESCE(sum(case when ${orders.createdAt} >= ${startOfDay} then ${orders.total} else 0 end), 0)::float`,
      thisWeek: sql<number>`COALESCE(sum(case when ${orders.createdAt} >= ${startOfWeek} then ${orders.total} else 0 end), 0)::float`,
      thisMonth: sql<number>`COALESCE(sum(case when ${orders.createdAt} >= ${startOfMonth} then ${orders.total} else 0 end), 0)::float`,
    })
    .from(orders)
    .where(eq(orders.paymentStatus, "paid"));

  return {
    today: row?.today ?? 0,
    thisWeek: row?.thisWeek ?? 0,
    thisMonth: row?.thisMonth ?? 0,
    total: row?.total ?? 0,
  };
}

export async function getLowStockProducts(threshold = 10) {
  if (!db) return [];
  return db
    .select({
      id: products.id,
      name: products.name,
      sku: products.sku,
      stockQuantity: products.stockQuantity,
    })
    .from(products)
    .where(and(eq(products.isActive, true), lte(products.stockQuantity, threshold)))
    .orderBy(products.stockQuantity)
    .limit(20);
}
