import { OrdersList } from "@/components/account/OrdersList";
import { getOrdersForUser } from "@/lib/actions/orders";

export default async function OrdersPage() {
  const list = await getOrdersForUser();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-950">My Orders</h2>
        <p className="mt-1 text-sm text-slate-500">
          Track deliveries and view your full order history.
        </p>
      </div>
      <OrdersList initialList={list} />
    </div>
  );
}
