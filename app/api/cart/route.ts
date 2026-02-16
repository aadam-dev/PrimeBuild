import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getCartByUserId } from "@/lib/db/queries/cart";
import { getProductById } from "@/lib/data/catalogue";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ entries: [] });
  }
  const entries = await getCartByUserId(session.user.id);
  const withProducts = await Promise.all(
    entries.map(async (e) => {
      const product = await getProductById(e.productId);
      return {
        productId: e.productId,
        quantity: e.quantity,
        product: product
          ? {
              id: product.id,
              name: product.name,
              slug: product.slug,
              price: product.price,
              unit: product.unit,
            }
          : null,
      };
    })
  );
  return NextResponse.json({
    entries: entries,
    items: withProducts,
  });
}
