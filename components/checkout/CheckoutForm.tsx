"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  FileText,
  Shield,
  ArrowRight,
  Loader2,
  Package,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrderFromProformaAction } from "@/lib/actions/orders";
import type { ProformaWithItems } from "@/lib/db/queries/proformas";

export function CheckoutForm({
  proforma,
}: {
  proforma: ProformaWithItems | null;
}) {
  const [paying, setPaying] = useState(false);

  const handlePay = async () => {
    if (!proforma) return;
    setPaying(true);
    const res = await createOrderFromProformaAction(proforma.id);
    if (!res.ok || !res.orderId) {
      setPaying(false);
      return;
    }
    const initRes = await fetch("/api/paystack/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: res.orderId }),
    });
    const data = await initRes.json().catch(() => ({}));
    setPaying(false);
    if (data.authorization_url) {
      window.location.href = data.authorization_url;
      return;
    }
    window.location.href = `/account/orders/${res.orderId}`;
  };

  if (!proforma) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 mb-4">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-lg font-bold text-slate-950">
          No proforma selected
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Choose an approved proforma to proceed with payment.
        </p>
        <Button
          className="mt-6 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-semibold px-6"
          asChild
        >
          <Link href="/account/proformas">
            Go to My Quotes <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    );
  }

  if (proforma.status !== "approved") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-12 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 mb-4">
          <FileText className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-950">
          Approval Required
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This quote must be approved by your stakeholder before you can place
          an order.
        </p>
        <Button
          className="mt-6 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-6"
          asChild
        >
          <Link href="/account/proformas">
            Back to Quotes <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quote Reference */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <FileText className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-950">
                {proforma.proformaNumber}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Approved
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-950">
            GH¢ {Number(proforma.total).toLocaleString("en-GH")}
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-slate-50/80">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            Order Items
          </h3>
        </div>
        <ul className="divide-y divide-slate-200/60">
          {proforma.items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <Package className="h-4 w-4 text-slate-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-950">
                    {item.productName}
                  </p>
                  <p className="text-xs text-slate-400">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-medium text-slate-950">
                GH¢ {item.lineTotal.toLocaleString("en-GH")}
              </p>
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-200/60 bg-slate-50/80">
          <span className="font-bold text-slate-950">Total</span>
          <span className="text-lg font-bold text-slate-950">
            GH¢ {Number(proforma.total).toLocaleString("en-GH")}
          </span>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Shield className="h-3.5 w-3.5" />
          Secured by Paystack
        </span>
        <span className="flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5" />
          MoMo, Visa, Mastercard
        </span>
      </div>

      {/* Pay Button */}
      <Button
        className="w-full h-12 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-base animate-pulse-ring"
        onClick={handlePay}
        disabled={paying}
      >
        {paying ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay GH¢ {Number(proforma.total).toLocaleString("en-GH")}
          </>
        )}
      </Button>

      <p className="text-center text-xs text-slate-400">
        You&apos;ll be redirected to Paystack to complete payment securely. If
        Paystack is not configured, the order will still be created.
      </p>
    </div>
  );
}
