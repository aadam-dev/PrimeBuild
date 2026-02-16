import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, proformas, proformaItems, suppliers } from "@/lib/db/schema";

export async function getAllOrders() {
  if (!db) return [];
  const list = await db.select().from(orders).orderBy(desc(orders.createdAt));
  const result = [];
  for (const row of list) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id));
    result.push({
      ...row,
      items: items.map((i) => ({
        id: i.id,
        productName: i.productName,
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
      })),
    });
  }
  return result;
}

export async function getAllProformas() {
  if (!db) return [];
  const list = await db.select().from(proformas).orderBy(desc(proformas.createdAt));
  const result = [];
  for (const row of list) {
    const items = await db.select().from(proformaItems).where(eq(proformaItems.proformaId, row.id));
    result.push({
      ...row,
      items: items.map((i) => ({
        id: i.id,
        productName: i.productName,
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
      })),
    });
  }
  return result;
}

export async function updateOrderStatusAdmin(orderId: string, status: string) {
  if (!db) return "error";
  await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, orderId));
  return "ok";
}

export async function updateOrderSupplierAdmin(orderId: string, supplierId: string | null) {
  if (!db) return "error";
  await db.update(orders).set({ assignedToSupplierId: supplierId, updatedAt: new Date() }).where(eq(orders.id, orderId));
  return "ok";
}

export async function getAllSuppliers() {
  if (!db) return [];
  return db.select().from(suppliers).where(eq(suppliers.isActive, true));
}

export async function getOrdersForSupplier(supplierId: string) {
  if (!db) return [];
  const list = await db
    .select()
    .from(orders)
    .where(eq(orders.assignedToSupplierId, supplierId))
    .orderBy(desc(orders.createdAt));
  const result = [];
  for (const row of list) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id));
    result.push({
      ...row,
      items: items.map((i) => ({
        id: i.id,
        productName: i.productName,
        quantity: i.quantity,
        lineTotal: Number(i.lineTotal),
      })),
    });
  }
  return result;
}

export async function getSupplierByUserId(userId: string) {
  if (!db) return null;
  const rows = await db.select().from(suppliers).where(eq(suppliers.userId, userId)).limit(1);
  return rows[0] ?? null;
}

export async function createSupplierAdmin(params: { name: string; email?: string | null; phone?: string | null }) {
  if (!db) return null;
  const [row] = await db.insert(suppliers).values({
    name: params.name,
    email: params.email ?? null,
    phone: params.phone ?? null,
    isActive: true,
  }).returning({ id: suppliers.id });
  return row?.id ?? null;
}

export async function getAdminReportStats() {
  if (!db) return null;
  const [orderStats] = await db
    .select({
      totalOrders: sql<number>`count(*)::int`,
      totalRevenue: sql<string>`COALESCE(sum(${orders.total}), 0)`,
      paidOrders: sql<number>`count(*) filter (where ${orders.paymentStatus} = 'paid')::int`,
    })
    .from(orders);
  const [proformaStats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      approved: sql<number>`count(*) filter (where ${proformas.status} = 'approved')::int`,
      converted: sql<number>`count(*) filter (where ${proformas.status} = 'converted')::int`,
    })
    .from(proformas);
  return {
    orderCount: orderStats?.totalOrders ?? 0,
    revenue: Number(orderStats?.totalRevenue ?? 0),
    paidCount: orderStats?.paidOrders ?? 0,
    proformaCount: proformaStats?.total ?? 0,
    proformaApproved: proformaStats?.approved ?? 0,
    proformaConverted: proformaStats?.converted ?? 0,
  };
}
