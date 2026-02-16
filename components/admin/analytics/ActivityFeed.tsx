"use client";

import { Activity, ShoppingCart, FileCheck, Package, UserCheck, AlertTriangle } from "lucide-react";

type ActivityItem = {
  id: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: unknown;
  createdAt: Date;
  userName: string | null;
};

const ACTION_ICONS: Record<string, typeof Activity> = {
  order_created: ShoppingCart,
  proforma_approved: FileCheck,
  product_updated: Package,
  user_created: UserCheck,
  low_stock: AlertTriangle,
};

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function ActivityFeed({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-slate-400">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
      {activities.map((a) => {
        const Icon = ACTION_ICONS[a.action] ?? Activity;
        return (
          <div key={a.id} className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-slate-50/60 transition-colors">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <Icon className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700">
                <span className="font-medium">{a.userName ?? "System"}</span>{" "}
                <span className="text-slate-500">{a.action.replace(/_/g, " ")}</span>
                {a.entityType && (
                  <span className="text-slate-500">
                    {" "}on {a.entityType} {a.entityId ? `#${a.entityId.slice(0, 8)}` : ""}
                  </span>
                )}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{timeAgo(a.createdAt)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
