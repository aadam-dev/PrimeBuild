import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi, isValidUUID, isValidOrderStatus } from "@/lib/auth-guards";
import { updateOrderStatusAdmin } from "@/lib/db/queries/admin";
import { insertActivity } from "@/lib/db/queries/activity";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const guard = await requireAdminApi();
  if (guard.error) return guard.error;

  const body = await req.json();
  const { orderId, status } = body;

  if (!orderId || !isValidUUID(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }
  if (!status || !isValidOrderStatus(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const result = await updateOrderStatusAdmin(orderId, status);
  if (result === "ok") {
    await insertActivity({
      userId: guard.user.id,
      action: "order_status_changed",
      entityType: "order",
      entityId: orderId,
      metadata: { status },
    });
  }
  return NextResponse.json({ result });
}
