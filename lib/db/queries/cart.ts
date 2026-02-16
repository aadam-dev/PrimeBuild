import { eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema";

export type CartRow = {
  productId: string;
  quantity: number;
};

export async function getCartByUserId(userId: string): Promise<CartRow[]> {
  if (!db) return [];
  const rows = await db
    .select({ productId: cartItems.productId, quantity: cartItems.quantity })
    .from(cartItems)
    .where(eq(cartItems.userId, userId));
  return rows.map((r) => ({ productId: r.productId, quantity: r.quantity }));
}

export async function addOrUpdateCartItem(
  userId: string,
  productId: string,
  quantity: number
): Promise<"ok" | "error"> {
  if (!db) return "error";
  if (quantity <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
    return "ok";
  }
  await db
    .insert(cartItems)
    .values({ userId, productId, quantity })
    .onConflictDoUpdate({
      target: [cartItems.userId, cartItems.productId],
      set: { quantity },
    });
  return "ok";
}

export async function setCartItemQuantity(
  userId: string,
  productId: string,
  quantity: number
): Promise<"ok" | "error"> {
  if (!db) return "error";
  if (quantity <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
    return "ok";
  }
  const updated = await db
    .update(cartItems)
    .set({ quantity })
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)))
    .returning({ id: cartItems.id });
  if (updated.length === 0) {
    await db.insert(cartItems).values({ userId, productId, quantity });
  }
  return "ok";
}

export async function removeCartItem(userId: string, productId: string): Promise<"ok" | "error"> {
  if (!db) return "error";
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
  return "ok";
}

/** Replace user's cart with given entries (e.g. merge guest cart on login). */
export async function setUserCart(userId: string, entries: { productId: string; quantity: number }[]): Promise<"ok" | "error"> {
  if (!db) return "error";
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
  const valid = entries.filter((e) => e.quantity > 0);
  if (valid.length === 0) return "ok";
  await db.insert(cartItems).values(
    valid.map((e) => ({ userId, productId: e.productId, quantity: e.quantity }))
  );
  return "ok";
}
