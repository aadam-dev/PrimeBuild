"use client";

import { useState, useTransition, Fragment } from "react";
import { useRouter } from "next/navigation";
import { Eye, Check, X, Download, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { exportToCSV } from "@/lib/utils/export";

type ProformaRow = {
  id: string;
  proformaNumber: string;
  status: string;
  total: string;
  createdAt: Date;
  userId: string;
  validUntil: string;
  items: Array<{ id: string; productName: string; quantity: number; lineTotal: number }>;
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  expired: "bg-slate-100 text-slate-500",
  converted: "bg-blue-100 text-blue-700",
  draft: "bg-slate-100 text-slate-500",
};

export function AdminProformasList({ initialList = [] }: { initialList: ProformaRow[] }) {
  const router = useRouter();
  const [list, setList] = useState(initialList);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleAction(proformaId: string, action: "approved" | "declined") {
    startTransition(async () => {
      const res = await fetch("/api/admin/proforma-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proformaId, action }),
      });
      if (res.ok) {
        setList((prev) =>
          prev.map((p) => (p.id === proformaId ? { ...p, status: action } : p))
        );
        router.refresh();
      }
    });
  }

  function handleExport() {
    exportToCSV(
      list.map((p) => ({
        "Proforma #": p.proformaNumber,
        Status: p.status,
        Total: Number(p.total),
        "Valid Until": p.validUntil,
        Date: new Date(p.createdAt).toLocaleDateString(),
        Items: p.items.map((i) => `${i.productName} (x${i.quantity})`).join("; "),
      })),
      "proformas-export"
    );
  }

  if (list.length === 0) {
    return <p className="mt-8 text-sm text-slate-400">No proformas yet.</p>;
  }

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
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Proforma</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Valid Until</th>
                <th className="text-left px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 font-semibold text-slate-600 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {list.map((p) => (
                <Fragment key={p.id}>
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-950">{p.proformaNumber}</td>
                    <td className="px-5 py-3.5">
                      <Badge className={`${STATUS_COLORS[p.status] ?? "bg-slate-100 text-slate-700"} text-xs`}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right font-medium text-slate-950">
                      GHS {Number(p.total).toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">{p.validUntil}</td>
                    <td className="px-5 py-3.5 text-xs text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="View details"
                        >
                          {expanded === p.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>
                        {p.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAction(p.id, "approved")}
                              disabled={isPending}
                              className="p-1.5 rounded-lg text-emerald-500 hover:bg-emerald-50 transition-colors"
                              title="Approve"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleAction(p.id, "declined")}
                              disabled={isPending}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              title="Decline"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expanded === p.id && (
                    <tr key={`${p.id}-detail`}>
                      <td colSpan={6} className="bg-slate-50/50 px-5 py-4">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Items</p>
                          {p.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-slate-600">
                                {item.productName} <span className="text-slate-400">&times; {item.quantity}</span>
                              </span>
                              <span className="font-medium text-slate-800">GHS {item.lineTotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
