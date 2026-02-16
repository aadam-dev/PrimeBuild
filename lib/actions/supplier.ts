"use server";

import { getSession } from "@/lib/auth-server";
import { getProfile } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { getSupplierByUserId, getOrdersForSupplier } from "@/lib/db/queries/admin";
import { updateOrderStatusAdmin } from "@/lib/db/queries/admin";
import { revalidatePath } from "next/cache";

export async function getSupplierOrders() {
  const session = await getSession();
  if (!session) redirect("/login?callbackUrl=/supplier");
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== "supplier") redirect("/");
  const supplier = await getSupplierByUserId(session.user.id);
  if (!supplier) return [];
  return getOrdersForSupplier(supplier.id);
}

export async function markOrderDispatchedAction(orderId: string) {
  const session = await getSession();
  if (!session) return { ok: false };
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== "supplier") return { ok: false };
  const supplier = await getSupplierByUserId(session.user.id);
  if (!supplier) return { ok: false };
  const result = await updateOrderStatusAdmin(orderId, "dispatched");
  revalidatePath("/supplier");
  return { ok: result === "ok" };
}
