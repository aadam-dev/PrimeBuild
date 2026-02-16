"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markOrderDispatchedAction } from "@/lib/actions/supplier";

type OrderRow = {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: Date;
  items: Array<{ productName: string; quantity: number; lineTotal: number }>;
};

export function SupplierOrdersList({ initialOrders = [] }: { initialOrders: OrderRow[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);

  const handleMarkDispatched = async (orderId: string) => {
    const res = await markOrderDispatchedAction(orderId);
    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "dispatched" } : o))
      );
      router.refresh();
    }
  };

  if (orders.length === 0) {
    return (
      <p className="mt-8 text-muted-foreground">No orders assigned to you yet.</p>
    );
  }

  return (
    <ul className="mt-8 space-y-4">
      {orders.map((o) => (
        <li key={o.id}>
          <Card>
            <CardContent className="p-4">
              <p className="font-medium">{o.orderNumber}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(o.createdAt).toLocaleString()} · GH¢ {Number(o.total).toLocaleString("en-GH")} · {o.status.replace("_", " ")}
              </p>
              <ul className="mt-2 text-sm text-muted-foreground">
                {o.items.map((i, idx) => (
                  <li key={idx}>
                    {i.productName} × {i.quantity} — GH¢ {i.lineTotal.toLocaleString("en-GH")}
                  </li>
                ))}
              </ul>
              {o.status !== "dispatched" && o.status !== "delivered" && (
                <Button
                  className="mt-3"
                  size="sm"
                  onClick={() => handleMarkDispatched(o.id)}
                >
                  Mark dispatched
                </Button>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
