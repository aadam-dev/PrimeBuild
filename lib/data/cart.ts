import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/lib/database.types";
import type { CartEntry } from "@/lib/hooks/use-cart";

export type CartItemWithProduct = CartEntry & { product: Product | null };

/** Resolve cart entries to products (mock). */
export function getCartItemsWithProducts(entries: CartEntry[]): CartItemWithProduct[] {
  return entries.map((e) => ({
    ...e,
    product: mockProducts.find((p) => p.id === e.productId) ?? null,
  }));
}

/** Items need at least product.price and quantity for subtotal. */
export function cartSubtotal(
  items: Array<{ product: { price: number } | null; quantity: number }>
): number {
  return items.reduce(
    (sum, i) => sum + (i.product ? i.product.price * i.quantity : 0),
    0
  );
}
