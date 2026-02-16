"use client";

import {
  useCart,
  getCartFromStorage,
  updateCartQuantity,
} from "@/lib/hooks/use-cart";
import { getCartItemsWithProducts, cartSubtotal } from "@/lib/data/cart";
import { useMemo, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  FileText,
  CreditCard,
  ShoppingCart,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RequestProformaButton } from "./RequestProformaButton";
import { authClient } from "@/lib/auth-client";
import { updateCartQuantityAction } from "@/lib/actions/cart";
import type { CartEntry } from "@/lib/hooks/use-cart";

type CartItemFromApi = {
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    unit: string;
  } | null;
};

export function CartContent() {
  const { data: session } = authClient.useSession();
  const localEntries = useCart();

  const [serverCart, setServerCart] = useState<{
    entries: CartEntry[];
    items: CartItemFromApi[];
  } | null>(null);
  const [serverLoading, setServerLoading] = useState(false);
  const fetchServerCart = useCallback(async () => {
    if (!session?.user) return;
    setServerLoading(true);
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setServerCart({ entries: data.entries ?? [], items: data.items ?? [] });
    } finally {
      setServerLoading(false);
    }
  }, [session?.user]);

  useEffect(() => {
    if (session?.user) fetchServerCart();
    else setServerCart(null);
  }, [session?.user, fetchServerCart]);

  const isServerCart = Boolean(session?.user && serverCart);
  const entries: CartEntry[] = isServerCart
    ? serverCart!.entries
    : localEntries;
  const items = useMemo(() => {
    if (isServerCart && serverCart) {
      return serverCart.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        product: i.product
          ? {
              id: i.product.id,
              name: i.product.name,
              slug: i.product.slug,
              price: i.product.price,
              unit: i.product.unit,
            }
          : null,
      })) as CartItemFromApi[];
    }
    return getCartItemsWithProducts(localEntries);
  }, [isServerCart, serverCart, localEntries]);
  const subtotal = useMemo(() => cartSubtotal(items), [items]);
  const validItems = items.filter((i) => i.product != null);

  const handleUpdateQty = async (productId: string, quantity: number) => {
    if (isServerCart) {
      await updateCartQuantityAction(productId, quantity);
      await fetchServerCart();
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("primebuild-cart-updated"));
    } else {
      updateCartQuantity(productId, quantity);
    }
  };

  if (session?.user && serverLoading && !serverCart) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white p-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-amber-500" />
        <p className="mt-4 text-sm text-slate-500">Loading your materials...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white p-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <ShoppingCart className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-950">
          No materials yet
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Start adding materials to build your quote.
        </p>
        <Button
          className="mt-6 rounded-xl bg-slate-950 text-white hover:bg-slate-800"
          asChild
        >
          <Link href="/categories">
            Browse Catalog <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Items List */}
      <div className="lg:col-span-2 space-y-4">
        <AnimatePresence>
          {validItems.map((item, i) => (
            <motion.div
              key={item.productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-5 rounded-2xl border border-slate-200/60 bg-white p-5 transition-shadow hover:shadow-sm"
            >
              {/* Product Icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                <Package className="h-6 w-6 text-slate-400" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product!.slug}`}
                  className="font-semibold text-slate-950 hover:text-amber-600 transition-colors line-clamp-1"
                >
                  {item.product!.name}
                </Link>
                <p className="text-sm text-slate-500 mt-0.5">
                  GH&cent; {item.product!.price.toLocaleString("en-GH")} /{" "}
                  {item.product!.unit}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-slate-200"
                  onClick={() =>
                    handleUpdateQty(
                      item.productId,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    handleUpdateQty(
                      item.productId,
                      isNaN(v) ? 1 : Math.max(1, v)
                    );
                  }}
                  className="w-16 text-center rounded-lg border-slate-200 font-medium"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg border-slate-200"
                  onClick={() =>
                    handleUpdateQty(item.productId, item.quantity + 1)
                  }
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Line Total */}
              <div className="w-28 text-right">
                <p className="font-bold text-slate-950">
                  GH&cent;{" "}
                  {(item.product!.price * item.quantity).toLocaleString(
                    "en-GH"
                  )}
                </p>
                <p className="text-xs text-slate-400">
                  {item.quantity} {item.product!.unit}
                  {item.quantity > 1 ? "s" : ""}
                </p>
              </div>

              {/* Remove */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                onClick={() => handleUpdateQty(item.productId, 0)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-slate-200/60 bg-white p-6 space-y-6">
          <h3 className="text-lg font-bold text-slate-950">Order Summary</h3>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">
                Items ({validItems.length})
              </span>
              <span className="font-medium text-slate-950">
                GH&cent; {subtotal.toLocaleString("en-GH")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery</span>
              <span className="text-sm text-slate-500">Calculated later</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="font-bold text-slate-950">Subtotal</span>
              <span className="text-xl font-bold text-slate-950">
                GH&cent; {subtotal.toLocaleString("en-GH")}
              </span>
            </div>
          </div>

          {/* Price Lock Notice */}
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
            <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Prices locked for 7 days
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Generate a proforma to lock these wholesale rates.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <RequestProformaButton
              disabled={validItems.length === 0}
              cartEntries={entries}
            />
            <Button
              variant="outline"
              className="w-full rounded-xl border-slate-200 font-medium"
              disabled={validItems.length === 0}
              asChild
            >
              <Link href="/checkout">
                <CreditCard className="h-4 w-4 mr-1.5" />
                Instant Checkout
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
