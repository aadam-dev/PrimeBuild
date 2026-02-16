"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/database.types";
import { addToCart } from "@/lib/hooks/use-cart";
import { authClient } from "@/lib/auth-client";
import { addToCartAction } from "@/lib/actions/cart";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } },
};

function ProductCardFeatured({ product }: { product: Product }) {
  const { data: session } = authClient.useSession();
  const hasDiscount =
    product.compare_at_price != null && product.compare_at_price > product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.compare_at_price! - product.price) / product.compare_at_price!) * 100
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
      variants={item}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1"
    >
      {/* Image / Placeholder */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-50 overflow-hidden">
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <ShoppingCart className="h-8 w-8" />
              <span className="text-xs font-medium">{product.unit}</span>
            </div>
          </div>
          {/* Discount Badge */}
          {hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-amber-500 text-slate-950 hover:bg-amber-500 font-bold text-xs">
              -{discountPct}%
            </Badge>
          )}
          {/* Quick View overlay */}
          <div className="absolute inset-0 bg-slate-950/0 transition-colors group-hover:bg-slate-950/5" />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-slate-950 line-clamp-1 group-hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
          {product.short_description && (
            <p className="mt-1 text-sm text-slate-500 line-clamp-1">
              {product.short_description}
            </p>
          )}
        </Link>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-950">
            GH&cent; {product.price.toLocaleString("en-GH")}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-400 line-through">
              GH&cent; {product.compare_at_price!.toLocaleString("en-GH")}
            </span>
          )}
          <span className="text-xs text-slate-400">/ {product.unit}</span>
        </div>

        <Button
          onClick={handleAdd}
          size="sm"
          className="mt-4 w-full rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-medium"
        >
          <ShoppingCart className="h-4 w-4 mr-1" />
          Add to Quote
        </Button>
      </div>
    </motion.article>
  );
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="border-t border-slate-200/60 bg-slate-50/50 py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest text-amber-600"
            >
              Most Ordered
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
            >
              Featured Materials
            </motion.h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
          >
            View catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <ProductCardFeatured key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
