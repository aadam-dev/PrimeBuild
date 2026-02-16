import Link from "next/link";
import { FileText, Truck, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { getProformasForUser } from "@/lib/actions/proformas";
import { getOrdersForUser } from "@/lib/actions/orders";

export default async function AccountPage() {
  const proformas = await getProformasForUser();
  const orders = await getOrdersForUser();

  const pendingQuotes = proformas.filter((p) => p.status === "pending").length;
  const approvedQuotes = proformas.filter((p) => p.status === "approved").length;
  const activeOrders = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ).length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  const stats = [
    {
      label: "Pending Quotes",
      value: pendingQuotes,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      href: "/account/proformas",
    },
    {
      label: "Approved",
      value: approvedQuotes,
      icon: FileText,
      color: "bg-emerald-50 text-emerald-600",
      href: "/account/proformas",
    },
    {
      label: "Active Orders",
      value: activeOrders,
      icon: Truck,
      color: "bg-blue-50 text-blue-600",
      href: "/account/orders",
    },
    {
      label: "Delivered",
      value: deliveredOrders,
      icon: TrendingUp,
      color: "bg-slate-100 text-slate-600",
      href: "/account/orders",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group rounded-2xl border border-slate-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 translate-x-[-4px] transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </div>
            <p className="mt-4 text-3xl font-bold text-slate-950">
              {stat.value}
            </p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/account/proformas"
          className="group flex items-center gap-5 rounded-2xl border border-slate-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
            <FileText className="h-7 w-7 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">My Proformas</h3>
            <p className="text-sm text-slate-500">
              View, share, and track approval on your quotes.
            </p>
          </div>
        </Link>
        <Link
          href="/account/orders"
          className="group flex items-center gap-5 rounded-2xl border border-slate-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-0.5"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10">
            <Truck className="h-7 w-7 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-950">My Orders</h3>
            <p className="text-sm text-slate-500">
              Track deliveries and view order history.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
