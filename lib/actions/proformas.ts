"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth-server";
import {
  getProformasByUserId,
  getProformaById,
  getProformaByShareToken,
  createProforma as createProformaDb,
  updateProformaStatus,
  insertApprovalAction,
} from "@/lib/db/queries/proformas";
import { setUserCart } from "@/lib/db/queries/cart";
import { getProductById } from "@/lib/data/catalogue";
import { PROFORMA_VALIDITY_DAYS, SITE_URL } from "@/lib/constants";
import { sendProformaShared, sendProformaApproved, sendProformaDeclined } from "@/lib/email";
import { getUserEmail } from "@/lib/db/queries/user";

function generateToken(): string {
  const arr = new Uint8Array(24);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(arr);
  }
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getProformasForUser() {
  const session = await getSession();
  if (!session) return [];
  return getProformasByUserId(session.user.id);
}

export async function getProformaForUser(id: string) {
  const session = await getSession();
  if (!session) return null;
  const p = await getProformaById(id);
  if (!p || p.userId !== session.user.id) return null;
  return p;
}

export async function getProformaByToken(token: string) {
  return getProformaByShareToken(token);
}

export type CreateProformaInput = { productId: string; quantity: number }[];

export async function createProformaFromCartAction(
  cartEntries: CreateProformaInput
): Promise<{ ok: boolean; proformaId?: string; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in" };
  const items: Array<{
    productId: string | null;
    productName: string;
    unitPrice: string;
    quantity: number;
    lineTotal: string;
  }> = [];
  let subtotal = 0;
  for (const e of cartEntries) {
    if (e.quantity <= 0) continue;
    const product = await getProductById(e.productId);
    if (!product) continue;
    const lineTotal = product.price * e.quantity;
    subtotal += lineTotal;
    items.push({
      productId: product.id,
      productName: product.name,
      unitPrice: String(product.price),
      quantity: e.quantity,
      lineTotal: String(lineTotal),
    });
  }
  if (items.length === 0) return { ok: false, error: "Cart is empty or products not found" };
  const tax = 0;
  const total = subtotal + tax;
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + PROFORMA_VALIDITY_DAYS);
  const proformaNumber = `PF-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 8)}`;
  const shareToken = generateToken();
  const result = await createProformaDb({
    userId: session.user.id,
    proformaNumber,
    shareToken,
    validUntil: validUntil.toISOString().slice(0, 10),
    subtotal: String(subtotal),
    tax: String(tax),
    total: String(total),
    items,
  });
  if (!result) return { ok: false, error: "Failed to create proforma" };
  await setUserCart(session.user.id, []);
  const to = await getUserEmail(session.user.id);
  if (to) {
    sendProformaShared({
      to,
      proformaNumber,
      shareUrl: `${SITE_URL}/share/${shareToken}`,
    }).catch(() => {});
  }
  revalidatePath("/account/proformas");
  revalidatePath("/api/cart");
  return { ok: true, proformaId: result.id };
}

export async function approveOrDeclineProformaAction(
  token: string,
  action: "approved" | "declined",
  options?: { actorName?: string; actorEmail?: string; comment?: string }
): Promise<{ ok: boolean; error?: string }> {
  const proforma = await getProformaByShareToken(token);
  if (!proforma) return { ok: false, error: "Proforma not found" };
  if (proforma.status !== "pending") return { ok: false, error: "Already processed" };
  await insertApprovalAction({
    proformaId: proforma.id,
    action,
    actorName: options?.actorName ?? null,
    actorEmail: options?.actorEmail ?? null,
    comment: options?.comment ?? null,
  });
  await updateProformaStatus(proforma.id, action);
  const to = await getUserEmail(proforma.userId);
  if (to) {
    if (action === "approved") {
      sendProformaApproved({
        to,
        proformaNumber: proforma.proformaNumber,
        actorName: options?.actorName ?? null,
        comment: options?.comment ?? null,
      }).catch(() => {});
    } else {
      sendProformaDeclined({
        to,
        proformaNumber: proforma.proformaNumber,
        actorName: options?.actorName ?? null,
        comment: options?.comment ?? null,
      }).catch(() => {});
    }
  }
  revalidatePath("/share/[token]");
  return { ok: true };
}
