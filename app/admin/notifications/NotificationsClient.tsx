"use client";

import { useState, useTransition } from "react";
import { Check, ShoppingCart, FileCheck, AlertTriangle, Bell as BellIcon, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
};

const TYPE_ICONS: Record<string, typeof BellIcon> = {
  order_status: ShoppingCart,
  new_order: ShoppingCart,
  proforma_approved: FileCheck,
  low_stock: AlertTriangle,
  delivery_update: Truck,
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function NotificationsClient({ notifications: initial }: { notifications: Notification[] }) {
  const [notifications, setNotifications] = useState(initial);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isPending, startTransition] = useTransition();

  const filtered = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  async function handleMarkAllRead() {
    startTransition(async () => {
      const res = await fetch("/api/notifications/mark-all-read", { method: "POST" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === "all" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === "unread" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            Unread
          </button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          disabled={isPending}
          className="rounded-xl text-xs"
        >
          <Check className="h-3.5 w-3.5 mr-1" />
          Mark all read
        </Button>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200/60 bg-white py-16 text-center">
            <BellIcon className="h-10 w-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const Icon = TYPE_ICONS[n.type] ?? BellIcon;
            return (
              <div
                key={n.id}
                className={`rounded-xl border p-4 transition-colors ${
                  n.isRead
                    ? "border-slate-200/60 bg-white"
                    : "border-amber-200/60 bg-amber-50/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <Icon className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                      {!n.isRead && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                    </div>
                    <p className="text-sm text-slate-500 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
