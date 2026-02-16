import { BarChart3, TrendingUp, DollarSign, Users, ShoppingCart } from "lucide-react";
import { RevenueChart } from "@/components/admin/analytics/RevenueChart";
import { OrderStatusChart } from "@/components/admin/analytics/OrderStatusChart";
import { ConversionFunnel } from "@/components/admin/analytics/ConversionFunnel";
import { TopProductsChart } from "@/components/admin/analytics/TopProductsChart";
import { ActivityFeed } from "@/components/admin/analytics/ActivityFeed";
import {
  getRevenueByPeriod,
  getOrdersByStatus,
  getProformaConversionFunnel,
  getTopProductsByRevenue,
  getRevenueStats,
  getCustomerCount,
} from "@/lib/db/queries/analytics";
import { getRecentActivity } from "@/lib/db/queries/activity";

export const metadata = { title: "Analytics | Admin" };

export default async function AnalyticsPage() {
  const [revenueData, orderStatus, funnel, topProducts, revenueStats, customerCount, recentActivity] =
    await Promise.all([
      getRevenueByPeriod(30),
      getOrdersByStatus(),
      getProformaConversionFunnel(),
      getTopProductsByRevenue(10),
      getRevenueStats(),
      getCustomerCount(),
      getRecentActivity(15),
    ]);

  const stats = [
    { label: "Total Revenue", value: `GHS ${revenueStats.total.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-500/10" },
    { label: "This Month", value: `GHS ${revenueStats.thisMonth.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: "text-amber-600 bg-amber-500/10" },
    { label: "Total Orders", value: orderStatus.reduce((s, r) => s + r.count, 0), icon: ShoppingCart, color: "text-blue-600 bg-blue-500/10" },
    { label: "Customers", value: customerCount, icon: Users, color: "text-violet-600 bg-violet-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <BarChart3 className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950">Analytics</h2>
            <p className="text-sm text-slate-500">Platform performance overview — last 30 days</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200/60 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
                <p className="text-lg font-bold text-slate-950">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/60 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-950">Revenue Over Time</h3>
          <RevenueChart data={revenueData} />
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-950">Orders by Status</h3>
          <OrderStatusChart data={orderStatus} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-950">Proforma Conversion Funnel</h3>
          <ConversionFunnel data={funnel} />
        </div>
        <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-950">Top Products by Revenue</h3>
          <TopProductsChart data={topProducts} />
        </div>
      </div>

      {/* Activity Feed */}
      <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
        <h3 className="mb-4 font-semibold text-slate-950">Recent Activity</h3>
        <ActivityFeed activities={recentActivity as any} />
      </div>
    </div>
  );
}
