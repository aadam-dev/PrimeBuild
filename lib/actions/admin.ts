"use server";

import { revalidatePath } from "next/cache";
import { requireSession, requireAdmin } from "@/lib/auth-server";
import {
  getAllOrders,
  getAllProformas,
  getAllSuppliers,
  updateOrderStatusAdmin,
  updateOrderSupplierAdmin,
  createSupplierAdmin,
  getAdminReportStats,
} from "@/lib/db/queries/admin";

async function requireAdminSession() {
  const session = await requireSession();
  await requireAdmin(session);
}

export async function getAdminOrders() {
  await requireAdminSession();
  return getAllOrders();
}

export async function getAdminProformas() {
  await requireAdminSession();
  return getAllProformas();
}

export async function getAdminSuppliers() {
  await requireAdminSession();
  return getAllSuppliers();
}

export async function getAdminReport() {
  await requireAdminSession();
  return getAdminReportStats();
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  await requireAdminSession();
  const result = await updateOrderStatusAdmin(orderId, status);
  revalidatePath("/admin/orders");
  return { ok: result === "ok" };
}

export async function updateOrderSupplierAction(orderId: string, supplierId: string | null) {
  await requireAdminSession();
  const result = await updateOrderSupplierAdmin(orderId, supplierId);
  revalidatePath("/admin/orders");
  revalidatePath("/supplier");
  return { ok: result === "ok" };
}

export async function createSupplierAction(params: { name: string; email?: string; phone?: string }) {
  await requireAdminSession();
  const id = await createSupplierAdmin(params);
  revalidatePath("/admin/orders");
  revalidatePath("/admin/suppliers");
  return { ok: Boolean(id), id: id ?? undefined };
}
