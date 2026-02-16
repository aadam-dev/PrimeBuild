"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth-server";
import { getProformaById, updateProformaStatus } from "@/lib/db/queries/proformas";
import {
  getOrdersByUserId,
  getOrderById as getOrderByIdDb,
  createOrder,
  updateOrderPayment,
} from "@/lib/db/queries/orders";
import { sendOrderConfirmed } from "@/lib/email";
import { getUserEmail } from "@/lib/db/queries/user";

export async function getOrdersForUser() {
  const session = await getSession();
  if (!session) return [];
  return getOrdersByUserId(session.user.id);
}

export async function getOrderForUser(id: string) {
  const session = await getSession();
  if (!session) return null;
  const o = await getOrderByIdDb(id);
  if (!o || o.userId !== session.user.id) return null;
  return o;
}

export async function createOrderFromProformaAction(proformaId: string): Promise<{ ok: boolean; orderId?: string; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in" };
  const proforma = await getProformaById(proformaId);
  if (!proforma) return { ok: false, error: "Proforma not found" };
  if (proforma.userId !== session.user.id) return { ok: false, error: "Unauthorized" };
  if (proforma.status !== "approved") return { ok: false, error: "Proforma must be approved first" };
  const orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8)}`;
  const result = await createOrder({
    userId: session.user.id,
    proformaId: proforma.id,
    orderNumber,
    subtotal: String(proforma.subtotal),
    tax: String(proforma.tax),
    total: String(proforma.total),
    items: proforma.items.map((i) => ({
      productId: i.productId,
      productName: i.productName,
      unitPrice: String(i.unitPrice),
      quantity: i.quantity,
      lineTotal: String(i.lineTotal),
    })),
  });
  if (!result) return { ok: false, error: "Failed to create order" };
  await updateProformaStatus(proformaId, "converted");
  const to = await getUserEmail(session.user.id);
  if (to) {
    sendOrderConfirmed({
      to,
      orderNumber,
      total: proforma.total,
    }).catch(() => {});
  }
  revalidatePath("/account/orders");
  revalidatePath("/account/proformas");
  return { ok: true, orderId: result.id };
}

export async function updateOrderPaymentAction(
  orderId: string,
  paymentStatus: string,
  paymentReference?: string | null
) {
  return updateOrderPayment(orderId, paymentStatus, paymentReference);
}
