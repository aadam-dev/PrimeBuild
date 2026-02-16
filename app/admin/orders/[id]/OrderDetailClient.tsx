"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  orderId: string;
  currentStatus: string;
  currentSupplierId: string | null;
  suppliers: { id: string; name: string }[];
};

const STATUSES = [
  { value: "confirmed", label: "Confirmed" },
  { value: "with_supplier", label: "With Supplier" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderDetailClient({ orderId, currentStatus, currentSupplierId, suppliers }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await fetch("/api/admin/order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: e.target.value }),
      });
      router.refresh();
    });
  }

  async function handleSupplierChange(e: React.ChangeEvent<HTMLSelectElement>) {
    startTransition(async () => {
      await fetch("/api/admin/order-supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, supplierId: e.target.value || null }),
      });
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
      <h3 className="font-semibold text-slate-950 mb-4">Manage Order</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Order Status</label>
          <select
            defaultValue={currentStatus}
            onChange={handleStatusChange}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Assign Supplier</label>
          <select
            defaultValue={currentSupplierId ?? ""}
            onChange={handleSupplierChange}
            disabled={isPending}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm bg-white"
          >
            <option value="">— None —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
