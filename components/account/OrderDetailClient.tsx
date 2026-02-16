"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Truck,
  Package,
  Building,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { OrderWithItems } from "@/lib/db/queries/orders";

const statusSteps = [
  {
    key: "confirmed",
    label: "Order Confirmed",
    description: "Your order has been received and confirmed.",
    icon: CheckCircle2,
  },
  {
    key: "with_supplier",
    label: "With Supplier",
    description: "Materials are being prepared by the supplier.",
    icon: Building,
  },
  {
    key: "dispatched",
    label: "En Route",
    description: "Your materials are on their way to the site.",
    icon: Truck,
  },
  {
    key: "delivered",
    label: "Delivered",
    description: "Materials have been delivered to your site.",
    icon: Package,
  },
] as const;

const statusBadgeConfig: Record<string, string> = {
  confirmed: "border-blue-200 bg-blue-50 text-blue-700",
  with_supplier: "border-amber-200 bg-amber-50 text-amber-700",
  dispatched: "border-violet-200 bg-violet-50 text-violet-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
};

export function OrderDetailClient({ order }: { order: OrderWithItems }) {
  const stepKeys = statusSteps.map((s) => s.key);
  const currentStep = Math.max(
    0,
    stepKeys.indexOf(order.status as (typeof stepKeys)[number])
  );

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link
          href="/account/orders"
          className="hover:text-slate-950 transition-colors"
        >
          Orders
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-950 font-medium">{order.orderNumber}</span>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/60 bg-white p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-slate-950 font-mono">
                {order.orderNumber}
              </h1>
              <Badge
                variant="outline"
                className={`text-xs font-semibold rounded-lg ${
                  statusBadgeConfig[order.status] || ""
                }`}
              >
                {order.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Placed{" "}
              {new Date(order.createdAt).toLocaleDateString("en-GH", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              &middot; Payment: {order.paymentStatus}
              {order.paymentReference && ` · Ref: ${order.paymentReference}`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Delivery Timeline (Vertical Stepper) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200/60 bg-white p-6"
      >
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
          Delivery Timeline
        </h3>
        <div className="relative">
          {statusSteps.map((step, i) => {
            const isComplete = i <= currentStep;
            const isCurrent = i === currentStep;
            const StepIcon = step.icon;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex gap-4 pb-8 last:pb-0"
              >
                {/* Line + Dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isComplete
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-100 text-slate-400"
                    } ${isCurrent ? "ring-4 ring-amber-500/20" : ""}`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  {i < statusSteps.length - 1 && (
                    <div
                      className={`w-0.5 flex-1 mt-2 ${
                        i < currentStep ? "bg-amber-500" : "bg-slate-200"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1">
                  <p
                    className={`font-semibold ${
                      isComplete ? "text-slate-950" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p
                    className={`text-sm mt-0.5 ${
                      isComplete ? "text-slate-500" : "text-slate-300"
                    }`}
                  >
                    {step.description}
                  </p>
                  {isCurrent && order.status !== "delivered" && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1">
                      <Clock className="h-3 w-3" />
                      Current status
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200/60">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Order Items
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/60 text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Material</th>
                <th className="px-6 py-3 font-medium text-center">Qty</th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-950">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-950">
                    GH&cent; {item.lineTotal.toLocaleString("en-GH")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-5 bg-slate-50 border-t border-slate-200/60">
          <div className="flex items-center justify-end gap-6">
            <span className="text-sm text-slate-500">Grand Total</span>
            <span className="text-2xl font-bold text-slate-950">
              GH&cent; {Number(order.total).toLocaleString("en-GH")}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
