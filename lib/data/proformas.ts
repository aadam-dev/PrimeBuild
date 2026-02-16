import { mockProducts } from "@/lib/mock-data";
import type { CartEntry } from "@/lib/hooks/use-cart";
import { PROFORMA_VALIDITY_DAYS } from "@/lib/constants";
import { SITE_URL } from "@/lib/constants";

const STORAGE_KEY = "primebuild_proformas";

export type ProformaStored = {
  id: string;
  proformaNumber: string;
  shareToken: string;
  status: "pending" | "approved" | "declined" | "expired" | "converted";
  validUntil: string;
  items: { productId: string; productName: string; unitPrice: number; quantity: number; lineTotal: number }[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
};

function loadProformas(): ProformaStored[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveProformas(list: ProformaStored[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("storage"));
}

function generateToken(): string {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Create proforma from current cart (client-side). Returns the new proforma or null. */
export function createProformaFromCart(cartEntries: CartEntry[]): ProformaStored | null {
  const items: ProformaStored["items"] = [];
  let subtotal = 0;
  for (const e of cartEntries) {
    const product = mockProducts.find((p) => p.id === e.productId);
    if (!product || e.quantity <= 0) continue;
    const lineTotal = product.price * e.quantity;
    subtotal += lineTotal;
    items.push({
      productId: product.id,
      productName: product.name,
      unitPrice: product.price,
      quantity: e.quantity,
      lineTotal,
    });
  }
  if (items.length === 0) return null;

  const tax = 0;
  const total = subtotal + tax;
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + PROFORMA_VALIDITY_DAYS);

  const list = loadProformas();
  const num = list.length + 1;
  const proformaNumber = `PF-${Date.now().toString(36).toUpperCase()}-${num}`;
  const id = `proforma-${Date.now()}-${generateToken().slice(0, 8)}`;
  const shareToken = generateToken();

  const proforma: ProformaStored = {
    id,
    proformaNumber,
    shareToken,
    status: "pending",
    validUntil: validUntil.toISOString().slice(0, 10),
    items,
    subtotal,
    tax,
    total,
    createdAt: new Date().toISOString(),
  };
  list.unshift(proforma);
  saveProformas(list);
  return proforma;
}

export function getProformas(): ProformaStored[] {
  return loadProformas();
}

export function getProformaById(id: string): ProformaStored | null {
  return loadProformas().find((p) => p.id === id) ?? null;
}

export function getProformaByShareToken(token: string): ProformaStored | null {
  return loadProformas().find((p) => p.shareToken === token) ?? null;
}

/** Approve or decline (for share page). Returns true if updated. */
export function approveOrDeclineProforma(
  token: string,
  action: "approved" | "declined"
): boolean {
  const list = loadProformas();
  const idx = list.findIndex((p) => p.shareToken === token && p.status === "pending");
  if (idx === -1) return false;
  list[idx].status = action;
  saveProformas(list);
  return true;
}

export function getShareUrl(shareToken: string): string {
  return `${typeof window !== "undefined" ? window.location.origin : SITE_URL}/share/${shareToken}`;
}
