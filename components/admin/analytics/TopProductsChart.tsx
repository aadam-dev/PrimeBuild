"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type TopProduct = { productName: string; totalRevenue: number; totalQuantity: number };

export function TopProductsChart({ data }: { data: TopProduct[] }) {
  const chartData = data.map((d) => ({
    name: d.productName.length > 25 ? d.productName.slice(0, 25) + "…" : d.productName,
    revenue: d.totalRevenue,
    qty: d.totalQuantity,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        No product data
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `GHS ${(v / 1000).toFixed(0)}k`} />
        <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 11, fill: "#64748b" }} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
          formatter={(v) => [`GHS ${Number(v).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`, "Revenue"]}
        />
        <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
