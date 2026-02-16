import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { proformas, proformaItems, approvalActions } from "@/lib/db/schema";

export type ProformaWithItems = {
  id: string;
  userId: string;
  proformaNumber: string;
  shareToken: string;
  status: string;
  validUntil: string;
  subtotal: number;
  tax: number;
  total: number;
  notes: string | null;
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

function mapProforma(
  row: typeof proformas.$inferSelect,
  items: typeof proformaItems.$inferSelect[]
): ProformaWithItems {
  return {
    id: row.id,
    userId: row.userId,
    proformaNumber: row.proformaNumber,
    shareToken: row.shareToken,
    status: row.status,
    validUntil: row.validUntil,
    subtotal: Number(row.subtotal),
    tax: Number(row.tax),
    total: Number(row.total),
    notes: row.notes,
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

export async function getProformasByUserId(userId: string): Promise<ProformaWithItems[]> {
  if (!db) return [];
  const list = await db
    .select()
    .from(proformas)
    .where(eq(proformas.userId, userId))
    .orderBy(desc(proformas.createdAt));
  const result: ProformaWithItems[] = [];
  for (const row of list) {
    const items = await db.select().from(proformaItems).where(eq(proformaItems.proformaId, row.id));
    result.push(mapProforma(row, items));
  }
  return result;
}

export async function getProformaById(id: string): Promise<ProformaWithItems | null> {
  if (!db) return null;
  const rows = await db.select().from(proformas).where(eq(proformas.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  const items = await db.select().from(proformaItems).where(eq(proformaItems.proformaId, row.id));
  return mapProforma(row, items);
}

export async function getProformaByShareToken(token: string): Promise<ProformaWithItems | null> {
  if (!db) return null;
  const rows = await db.select().from(proformas).where(eq(proformas.shareToken, token)).limit(1);
  const row = rows[0];
  if (!row) return null;
  const items = await db.select().from(proformaItems).where(eq(proformaItems.proformaId, row.id));
  return mapProforma(row, items);
}

export async function createProforma(params: {
  userId: string;
  proformaNumber: string;
  shareToken: string;
  validUntil: string;
  subtotal: string;
  tax: string;
  total: string;
  notes?: string | null;
  items: Array<{
    productId: string | null;
    productName: string;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
  }>;
}): Promise<{ id: string } | null> {
  if (!db) return null;
  const [inserted] = await db
    .insert(proformas)
    .values({
      userId: params.userId,
      proformaNumber: params.proformaNumber,
      shareToken: params.shareToken,
      status: "pending",
      validUntil: params.validUntil,
      subtotal: params.subtotal,
      tax: params.tax,
      total: params.total,
      notes: params.notes ?? null,
    })
    .returning({ id: proformas.id });
  if (!inserted) return null;
  if (params.items.length > 0) {
    await db.insert(proformaItems).values(
      params.items.map((i) => ({
        proformaId: inserted.id,
        productId: i.productId,
        productName: i.productName,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
      }))
    );
  }
  return { id: inserted.id };
}

export async function updateProformaStatus(id: string, status: string): Promise<"ok" | "error"> {
  if (!db) return "error";
  await db.update(proformas).set({ status, updatedAt: new Date() }).where(eq(proformas.id, id));
  return "ok";
}

export async function insertApprovalAction(params: {
  proformaId: string;
  action: "approved" | "declined";
  actorName?: string | null;
  actorEmail?: string | null;
  comment?: string | null;
}): Promise<"ok" | "error"> {
  if (!db) return "error";
  await db.insert(approvalActions).values(params);
  return "ok";
}

export async function getApprovalActions(proformaId: string) {
  if (!db) return [];
  return db.select().from(approvalActions).where(eq(approvalActions.proformaId, proformaId));
}
