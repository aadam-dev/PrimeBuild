import Link from "next/link";
import { requireSession, requireAdmin } from "@/lib/auth-server";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { getUnreadCount, getUserNotifications } from "@/lib/db/queries/notifications";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  FileText,
  Truck,
  ArrowLeft,
  BarChart3,
  Users,
  Bell,
} from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Layers },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/proformas", label: "Proformas", icon: FileText },
  { href: "/admin/suppliers", label: "Suppliers", icon: Truck },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  await requireAdmin(session);
  const [unreadCount, recentNotifs] = await Promise.all([
    getUnreadCount(session.user.id),
    getUserNotifications(session.user.id, 8),
  ]);
  const notifData = recentNotifs.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message,
    isRead: n.isRead,
    link: n.link,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Administration
              </span>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                Back Office
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell initialCount={unreadCount} initialNotifications={notifData} />
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-950 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {adminNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-white hover:text-slate-950 hover:shadow-sm"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Mobile Nav */}
          <div className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-slate-200/60 bg-white px-2 py-2 flex justify-around">
            {adminNav.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-2 py-1 text-[10px] text-slate-500"
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
