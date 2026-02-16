"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Truck, ExternalLink, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OrderWithItems } from "@/lib/db/queries/orders";

const statusConfig: Record<string, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  with_supplier: {
    label: "With Supplier",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  dispatched: {
    label: "Dispatched",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  delivered: {
    label: "Delivered",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-slate-200 bg-slate-50 text-slate-500",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } },
};

export function OrdersList({
  initialList = [],
}: {
  initialList?: OrderWithItems[];
}) {
  const list = initialList;

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white p-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <Truck className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-950">
          No orders yet
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Once a proforma is approved and paid, your orders will appear here.
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
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {list.map((o) => {
        const status = statusConfig[o.status] || statusConfig.confirmed;
        return (
          <motion.div
            key={o.id}
            variants={item}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 shrink-0">
              <Package className="h-5 w-5 text-slate-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-950 font-mono text-sm">
                  {o.orderNumber}
                </p>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold rounded-md ${status.className}`}
                >
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {new Date(o.createdAt).toLocaleDateString("en-GH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                &middot; GH&cent; {Number(o.total).toLocaleString("en-GH")}{" "}
                &middot; Payment: {o.paymentStatus}
              </p>
            </div>

            {/* Delivery Progress mini-indicator */}
            <div className="hidden sm:flex items-center gap-1">
              {["confirmed", "with_supplier", "dispatched", "delivered"].map(
                (step, i) => {
                  const steps = [
                    "confirmed",
                    "with_supplier",
                    "dispatched",
                    "delivered",
                  ];
                  const currentIdx = steps.indexOf(o.status);
                  const isCompleted = i <= currentIdx;
                  return (
                    <div key={step} className="flex items-center">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          isCompleted ? "bg-amber-500" : "bg-slate-200"
                        }`}
                      />
                      {i < 3 && (
                        <div
                          className={`h-0.5 w-4 ${
                            i < currentIdx ? "bg-amber-500" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-200 text-slate-600"
              asChild
            >
              <Link href={`/account/orders/${o.id}`}>
                Details <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
