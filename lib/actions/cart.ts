"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth-server";
import {
  getCartByUserId,
  addOrUpdateCartItem,
  setCartItemQuantity,
  removeCartItem,
  setUserCart,
} from "@/lib/db/queries/cart";

export async function addToCartAction(productId: string, quantity: number): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in" };
  const result = await addOrUpdateCartItem(session.user.id, productId, quantity);
  revalidatePath("/cart");
  revalidatePath("/api/cart");
  return { ok: result === "ok" };
}

export async function updateCartQuantityAction(productId: string, quantity: number): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in" };
  const result = await setCartItemQuantity(session.user.id, productId, quantity);
  revalidatePath("/cart");
  revalidatePath("/api/cart");
  return { ok: result === "ok" };
}

export async function removeFromCartAction(productId: string): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Not signed in" };
  const result = await removeCartItem(session.user.id, productId);
  revalidatePath("/cart");
  revalidatePath("/api/cart");
  return { ok: result === "ok" };
}

/** Merge guest cart (from localStorage) into user cart on login. Call with entries from client. */
export async function mergeGuestCartAction(entries: { productId: string; quantity: number }[]): Promise<{ ok: boolean }> {
  const session = await getSession();
  if (!session) return { ok: false };
  const current = await getCartByUserId(session.user.id);
  const map = new Map(current.map((e) => [e.productId, e.quantity]));
  for (const e of entries) {
    if (e.quantity <= 0) continue;
    const q = map.get(e.productId) ?? 0;
    map.set(e.productId, q + e.quantity);
  }
  const merged = Array.from(map.entries()).map(([productId, quantity]) => ({ productId, quantity }));
  const result = await setUserCart(session.user.id, merged);
  revalidatePath("/cart");
  revalidatePath("/api/cart");
  return { ok: result === "ok" };
}
