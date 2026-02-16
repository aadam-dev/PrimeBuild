"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction, updateOrderSupplierAction } from "@/lib/actions/admin";
import { exportToCSV } from "@/lib/utils/export";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  assignedToSupplierId: string | null;
  total: string;
  createdAt: Date;
  items: Array<{ productName: string; quantity: number; lineTotal: number }>;
};

type SupplierRow = { id: string; name: string };

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-amber-100 text-amber-700",
  with_supplier: "bg-blue-100 text-blue-700",
  dispatched: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

export function AdminOrdersList({
  initialOrders = [],
  suppliers = [],
}: {
  initialOrders: OrderRow[];
  suppliers: SupplierRow[];
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);

  const supplierMap = new Map(suppliers.map((s) => [s.id, s.name]));

  const handleStatusChange = async (orderId: string, status: string) => {
    const res = await updateOrderStatusAction(orderId, status);
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      router.refresh();
    }
  };

  const handleSupplierChange = async (orderId: string, supplierId: string | null) => {
    const res = await updateOrderSupplierAction(orderId, supplierId);
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, assignedToSupplierId: supplierId } : o
        )
      );
      router.refresh();
    }
  };

  function handleExport() {
    exportToCSV(
      orders.map((o) => ({
        "Order #": o.orderNumber,
        Status: o.status,
        Payment: o.paymentStatus,
        Total: Number(o.total),
        Supplier: o.assignedToSupplierId ? supplierMap.get(o.assignedToSupplierId) ?? "" : "",
        Date: new Date(o.createdAt).toLocaleDateString(),
        Items: o.items.map((i) => `${i.productName} (x${i.quantity})`).join("; "),
      })),
      "orders-export"
    );
  }

  if (orders.length === 0) {
    return <p className="mt-8 text-sm text-slate-400">No orders yet.</p>;
  }

  const statusOptions = ["confirmed", "with_supplier", "dispatched", "delivered", "cancelled"];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleExport} className="rounded-xl gap-1.5">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200/60 bg-slate-50/80">
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Payment</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Supplier</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-950">{o.orderNumber}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs bg-white"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge className={`${STATUS_COLORS[o.paymentStatus] ?? "bg-slate-100 text-slate-700"} text-xs`}>
                      {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right font-medium text-slate-950">
                    GHS {Number(o.total).toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5">
                    <select
                      value={o.assignedToSupplierId ?? "none"}
                      onChange={(e) => handleSupplierChange(o.id, e.target.value === "none" ? null : e.target.value)}
                      className="rounded-lg border border-slate-200 px-2 py-1 text-xs bg-white"
                    >
                      <option value="none">— None —</option>
                      {suppliers.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-slate-500">
                    {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 hover:text-amber-700"
                    >
                      <Eye className="h-3 w-3" /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
