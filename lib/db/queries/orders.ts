import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";

export type OrderWithItems = {
  id: string;
  userId: string;
  proformaId: string | null;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentReference: string | null;
  assignedToSupplierId: string | null;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productId: string | null;
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[];
};

function mapOrder(row: typeof orders.$inferSelect, items: typeof orderItems.$inferSelect[]): OrderWithItems {
  return {
    id: row.id,
    userId: row.userId,
    proformaId: row.proformaId,
    orderNumber: row.orderNumber,
    status: row.status,
    paymentStatus: row.paymentStatus,
    paymentReference: row.paymentReference,
    assignedToSupplierId: row.assignedToSupplierId,
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    total: Number(row.total),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    items: items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName,
      unitPrice: Number(i.unitPrice),
      quantity: i.quantity,
      lineTotal: Number(i.lineTotal),
    })),
  };
}

export async function getOrdersByUserId(userId: string): Promise<OrderWithItems[]> {
  if (!db) return [];
  const list = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
  const result: OrderWithItems[] = [];
  for (const row of list) {
    const itemRows = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id));
    result.push(mapOrder(row, itemRows));
  }
  return result;
}

export async function getOrderById(id: string): Promise<OrderWithItems | null> {
  if (!db) return null;
  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  const itemRows = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id));
  return mapOrder(row, itemRows);
}

export async function createOrder(params: {
  userId: string;
  proformaId: string | null;
  orderNumber: string;
  subtotal: string;
  tax: string;
  total: string;
  paymentStatus?: string;
  paymentReference?: string | null;
  items: { productId: string | null; productName: string; unitPrice: string; quantity: number; lineTotal: string }[];
}): Promise<{ id: string } | null> {
  if (!db) return null;
  const [inserted] = await db
    .insert(orders)
    .values({
      userId: params.userId,
      proformaId: params.proformaId,
      orderNumber: params.orderNumber,
      status: "confirmed",
      paymentStatus: params.paymentStatus ?? "pending",
      paymentReference: params.paymentReference ?? null,
      subtotal: params.subtotal,
      tax: params.tax,
      total: params.total,
    })
    .returning({ id: orders.id });
  if (!inserted) return null;
  if (params.items.length > 0) {
    await db.insert(orderItems).values(
      params.items.map((i) => ({
        orderId: inserted.id,
        productId: i.productId,
        productName: i.productName,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
      }))
    );
    for (const i of params.items) {
      if (i.productId) {
        await db.update(products).set({
          stockQuantity: sql`COALESCE(${products.stockQuantity}, 0) - ${i.quantity}`,
          updatedAt: new Date(),
        }).where(eq(products.id, i.productId));
      }
    }
  }
  return { id: inserted.id };
}

export async function updateOrderPayment(
  orderId: string,
  paymentStatus: string,
  paymentReference?: string | null
): Promise<"ok" | "error"> {
  if (!db) return "error";
  await db
    .update(orders)
    .set({ paymentStatus, paymentReference: paymentReference ?? null, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
  return "ok";
}
