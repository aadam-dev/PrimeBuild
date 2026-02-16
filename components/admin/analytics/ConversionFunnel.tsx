"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

type FunnelData = {
  total: number;
  pending: number;
  approved: number;
  converted: number;
  declined: number;
  expired: number;
};

const COLORS = ["#64748b", "#f59e0b", "#3b82f6", "#10b981", "#ef4444", "#94a3b8"];

export function ConversionFunnel({ data }: { data: FunnelData }) {
  const chartData = [
    { stage: "Created", count: data.total },
    { stage: "Pending", count: data.pending },
    { stage: "Approved", count: data.approved },
    { stage: "Converted", count: data.converted },
    { stage: "Declined", count: data.declined },
    { stage: "Expired", count: data.expired },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#94a3b8" }} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} allowDecimals={false} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
          formatter={(v) => [v, "Proformas"]}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={COLORS[i]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
