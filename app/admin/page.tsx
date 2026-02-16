import Link from "next/link";
import {
  ShoppingCart,
  DollarSign,
  FileText,
  CreditCard,
  Package,
  Layers,
  Truck,
  ArrowRight,
  BarChart3,
  Users,
  Bell,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { getAdminReport } from "@/lib/actions/admin";
import { getRecentActivity } from "@/lib/db/queries/activity";
import { ActivityFeed } from "@/components/admin/analytics/ActivityFeed";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboardPage() {
  const [stats, recentActivity] = await Promise.all([
    getAdminReport(),
    getRecentActivity(10),
  ]);

  const statCards = stats
    ? [
        {
          label: "Total Orders",
          value: stats.orderCount.toString(),
          icon: ShoppingCart,
          color: "bg-blue-500/10 text-blue-600",
        },
        {
          label: "Revenue",
          value: `GHS ${stats.revenue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`,
          icon: DollarSign,
          color: "bg-emerald-500/10 text-emerald-600",
        },
        {
          label: "Proformas",
          value: `${stats.proformaCount}`,
          sub: `${stats.proformaConverted} converted · ${stats.proformaApproved} approved`,
          icon: FileText,
          color: "bg-amber-500/10 text-amber-600",
        },
        {
          label: "Paid Orders",
          value: stats.paidCount.toString(),
          icon: CreditCard,
          color: "bg-purple-500/10 text-purple-600",
        },
      ]
    : [];

  const quickLinks = [
    { href: "/admin/analytics", label: "Analytics", description: "Charts & insights", icon: BarChart3 },
    { href: "/admin/products", label: "Products", description: "Manage catalogue", icon: Package },
    { href: "/admin/categories", label: "Categories", description: "Manage categories", icon: Layers },
    { href: "/admin/orders", label: "Orders", description: "View & assign orders", icon: ShoppingCart },
    { href: "/admin/proformas", label: "Proformas", description: "View all quotes", icon: FileText },
    { href: "/admin/suppliers", label: "Suppliers", description: "Manage suppliers", icon: Truck },
    { href: "/admin/users", label: "Users", description: "Manage accounts", icon: Users },
    { href: "/admin/notifications", label: "Notifications", description: "View alerts", icon: Bell },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-950">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Overview of orders, proformas, and revenue.
        </p>
      </div>

      {/* Stats */}
      {statCards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-200/60 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {card.label}
                </p>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}
                >
                  <card.icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-950">
                {card.value}
              </p>
              {card.sub && (
                <p className="mt-0.5 text-xs text-slate-400">{card.sub}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pending Actions */}
      {stats && (stats.proformaCount - stats.proformaConverted - (stats.proformaApproved ?? 0)) > 0 && (
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-slate-950">Pending Actions</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/proformas" className="inline-flex items-center gap-2 rounded-xl bg-white border border-amber-200/60 px-4 py-2.5 text-sm font-medium text-slate-700 hover:shadow-sm transition-all">
              <Clock className="h-4 w-4 text-amber-500" />
              Proformas awaiting review
              <Badge variant="secondary" className="ml-1 bg-amber-100 text-amber-700">
                {stats.proformaCount - stats.proformaConverted - (stats.proformaApproved ?? 0)}
              </Badge>
            </Link>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">
          Quick Access
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 transition-all hover:shadow-md hover:shadow-slate-200/50 hover:-translate-y-0.5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-amber-500/10 group-hover:text-amber-600 transition-colors">
                <link.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-950">{link.label}</p>
                <p className="text-xs text-slate-500">{link.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-950">Recent Activity</h3>
          <Link href="/admin/analytics" className="text-xs font-medium text-amber-600 hover:text-amber-700">
            View all
          </Link>
        </div>
        <ActivityFeed activities={recentActivity as any} />
      </div>
    </div>
  );
}
