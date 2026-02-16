import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ShoppingCart,
  User,
  Truck,
  CreditCard,
  Clock,
  Package,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, user, profile, suppliers } from "@/lib/db/schema";
import { getActivityByEntity } from "@/lib/db/queries/activity";
import { OrderDetailClient } from "./OrderDetailClient";

export const metadata = { title: "Order Detail | Admin" };

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-amber-100 text-amber-700",
  with_supplier: "bg-blue-100 text-blue-700",
  dispatched: "bg-violet-100 text-violet-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-red-100 text-red-700",
};

const PAYMENT_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  deposit_paid: "bg-blue-100 text-blue-700",
  paid: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!db) notFound();

  const [orderRow] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!orderRow) notFound();

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  const [customer] = await db
    .select({ name: user.name, email: user.email, phone: profile.phone })
    .from(user)
    .leftJoin(profile, eq(user.id, profile.id))
    .where(eq(user.id, orderRow.userId))
    .limit(1);

  let supplier = null;
  if (orderRow.assignedToSupplierId) {
    const [s] = await db.select().from(suppliers).where(eq(suppliers.id, orderRow.assignedToSupplierId)).limit(1);
    supplier = s ?? null;
  }

  const allSuppliers = await db.select({ id: suppliers.id, name: suppliers.name }).from(suppliers).where(eq(suppliers.isActive, true));
  const activity = await getActivityByEntity("order", id);

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-950 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-950">{orderRow.orderNumber}</h2>
            <p className="text-sm text-slate-500">
              Created {new Date(orderRow.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={`${STATUS_COLORS[orderRow.status] ?? "bg-slate-100 text-slate-700"} text-xs`}>
            {orderRow.status.replace(/_/g, " ")}
          </Badge>
          <Badge className={`${PAYMENT_COLORS[orderRow.paymentStatus] ?? "bg-slate-100 text-slate-700"} text-xs`}>
            {orderRow.paymentStatus.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
            <h3 className="font-semibold text-slate-950 mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-slate-400" /> Order Items
            </h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl bg-slate-50/80 p-3">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{item.productName}</p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity} &times; GHS {Number(item.unitPrice).toFixed(2)}</p>
                  </div>
                  <p className="font-semibold text-slate-950 text-sm">GHS {Number(item.lineTotal).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-slate-200/60 pt-4 flex justify-between">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-lg font-bold text-slate-950">GHS {Number(orderRow.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Status Management */}
          <OrderDetailClient
            orderId={orderRow.id}
            currentStatus={orderRow.status}
            currentSupplierId={orderRow.assignedToSupplierId}
            suppliers={allSuppliers.map((s) => ({ id: s.id, name: s.name }))}
          />

          {/* Activity */}
          {activity.length > 0 && (
            <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
              <h3 className="font-semibold text-slate-950 mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" /> Activity Log
              </h3>
              <div className="space-y-3">
                {activity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 mt-1.5 rounded-full bg-slate-300 shrink-0" />
                    <div>
                      <p className="text-sm text-slate-600">{a.action.replace(/_/g, " ")}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(a.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
            <h3 className="font-semibold text-slate-950 mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" /> Customer
            </h3>
            {customer ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-slate-800">{customer.name}</p>
                <p className="text-slate-500">{customer.email}</p>
                {customer.phone && <p className="text-slate-500">{customer.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-slate-400">Unknown customer</p>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
            <h3 className="font-semibold text-slate-950 mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-400" /> Payment
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <Badge className={`${PAYMENT_COLORS[orderRow.paymentStatus] ?? ""} text-xs`}>
                  {orderRow.paymentStatus}
                </Badge>
              </div>
              {orderRow.paymentReference && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Reference</span>
                  <span className="text-slate-700 font-mono text-xs">{orderRow.paymentReference}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-slate-700">GHS {Number(orderRow.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tax</span>
                <span className="text-slate-700">GHS {Number(orderRow.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-slate-950">GHS {Number(orderRow.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Supplier */}
          <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
            <h3 className="font-semibold text-slate-950 mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4 text-slate-400" /> Supplier
            </h3>
            {supplier ? (
              <div className="space-y-1 text-sm">
                <p className="font-medium text-slate-800">{supplier.name}</p>
                {supplier.email && <p className="text-slate-500">{supplier.email}</p>}
                {supplier.phone && <p className="text-slate-500">{supplier.phone}</p>}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No supplier assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
