import { SupplierOrdersList } from "@/components/supplier/SupplierOrdersList";
import { getSupplierOrders } from "@/lib/actions/supplier";

export default async function SupplierPage() {
  const orders = await getSupplierOrders();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-950">Assigned Orders</h2>
        <p className="mt-1 text-sm text-slate-500">
          Mark orders as dispatched when shipped. Use delivery codes for
          confirmation.
        </p>
      </div>
      <SupplierOrdersList initialOrders={orders} />
    </div>
  );
}
