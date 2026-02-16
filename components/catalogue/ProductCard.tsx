"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Package } from "lucide-react";
import type { Product } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/lib/hooks/use-cart";
import { authClient } from "@/lib/auth-client";
import { addToCartAction } from "@/lib/actions/cart";

export function ProductCard({ product }: { product: Product }) {
  const { data: session } = authClient.useSession();
  const price = product.price;
  const hasCompare =
    product.compare_at_price != null && product.compare_at_price > price;
  const discountPct = hasCompare
    ? Math.round(
        ((product.compare_at_price! - price) / product.compare_at_price!) * 100
      )
    : 0;

  const handleAdd = async () => {
    if (session?.user) {
      await addToCartAction(product.id, 1);
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("primebuild-cart-updated"));
    } else {
      addToCart(product.id, 1);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm"
    >
      <Link href={`/products/${product.slug}`} className="flex-1">
        <div className="relative aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-10 w-10 text-slate-200" />
            </div>
          )}
          {hasCompare && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-slate-950 hover:bg-amber-500 font-bold text-xs shadow-sm">
              -{discountPct}%
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <div className="p-5">
          <h2 className="font-semibold text-slate-950 line-clamp-2 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h2>
          {product.short_description && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-2">
              {product.short_description}
            </p>
          )}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-slate-950">
              GH&cent; {price.toLocaleString("en-GH")}
            </span>
            {hasCompare && (
              <span className="text-sm text-slate-400 line-through">
                GH&cent; {product.compare_at_price!.toLocaleString("en-GH")}
              </span>
            )}
            <span className="text-xs text-slate-400">/ {product.unit}</span>
          </div>
        </div>
      </Link>
      <div className="p-5 pt-0">
        <Button
          className="w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-medium"
          size="sm"
          onClick={handleAdd}
        >
          <ShoppingCart className="h-4 w-4 mr-1.5" />
          Add to Quote
        </Button>
      </div>
    </motion.article>
  );
}
