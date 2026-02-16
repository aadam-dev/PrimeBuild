"use client";

import { useState } from "react";
import { ShoppingCart, Check, Minus, Plus } from "lucide-react";
import type { Product } from "@/lib/database.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/lib/hooks/use-cart";
import { authClient } from "@/lib/auth-client";
import { addToCartAction } from "@/lib/actions/cart";

export function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);
  const { data: session } = authClient.useSession();

  const handleAdd = async () => {
    if (session?.user) {
      const res = await addToCartAction(product.id, qty);
      if (res.ok && typeof window !== "undefined")
        window.dispatchEvent(new Event("primebuild-cart-updated"));
    } else {
      addToCart(product.id, qty);
    }
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label htmlFor="qty" className="text-sm font-medium text-slate-700">
          Quantity
        </label>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg border-slate-200"
            onClick={() => setQty(Math.max(1, qty - 1))}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <Input
            id="qty"
            type="number"
            min={1}
            value={qty}
            onChange={(e) =>
              setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            className="w-20 text-center rounded-lg border-slate-200 font-medium"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg border-slate-200"
            onClick={() => setQty(qty + 1)}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
        <span className="text-sm text-slate-400">{product.unit}s</span>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={handleAdd}
          disabled={done}
          className="flex-1 h-12 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold text-base"
        >
          {done ? (
            <>
              <Check className="h-5 w-5 mr-2" />
              Added to Quote!
            </>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Quote
            </>
          )}
        </Button>
      </div>

      {/* Price Summary */}
      <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/60 p-4">
        <span className="text-sm text-slate-500">
          {qty} {product.unit}
          {qty > 1 ? "s" : ""} &times; GH&cent;{" "}
          {product.price.toLocaleString("en-GH")}
        </span>
        <span className="text-lg font-bold text-slate-950">
          GH&cent; {(product.price * qty).toLocaleString("en-GH")}
        </span>
      </div>
    </div>
  );
}
