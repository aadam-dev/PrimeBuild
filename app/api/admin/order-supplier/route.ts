import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, isValidUUID } from "@/lib/auth-guards";
import { updateOrderSupplierAdmin } from "@/lib/db/queries/admin";
import { insertActivity } from "@/lib/db/queries/activity";

export async function POST(req: NextRequest) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const { orderId, supplierId } = await req.json();

  if (!orderId || !isValidUUID(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }
  if (supplierId && !isValidUUID(supplierId)) {
    return NextResponse.json({ error: "Invalid supplier ID" }, { status: 400 });
  }

  const result = await updateOrderSupplierAdmin(orderId, supplierId ?? null);
  if (result === "ok") {
    await insertActivity({
      userId: guard.user.id,
      action: "order_supplier_assigned",
      entityType: "order",
      entityId: orderId,
      metadata: { supplierId },
    });
  }
  return NextResponse.json({ result });
}
