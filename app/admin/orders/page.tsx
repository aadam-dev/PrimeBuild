import { ShoppingCart } from "lucide-react";
import { AdminOrdersList } from "@/components/admin/AdminOrdersList";
import { getAdminOrders, getAdminSuppliers } from "@/lib/actions/admin";

export default async function AdminOrdersPage() {
  const [orders, suppliers] = await Promise.all([
    getAdminOrders(),
    getAdminSuppliers(),
  ]);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
          <ShoppingCart className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-950">Orders</h2>
          <p className="text-sm text-slate-500">
            Manage order status and assign to suppliers.
          </p>
        </div>
      </div>
      <AdminOrdersList initialOrders={orders} suppliers={suppliers} />
    </div>
  );
}
