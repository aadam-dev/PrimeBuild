import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getOrderForUser } from "@/lib/actions/orders";
import { updateOrderPayment } from "@/lib/db/queries/orders";
import { isUuid } from "@/lib/validation";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_TIMEOUT_MS = 15_000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  if (!reference || !isUuid(reference)) {
    return NextResponse.redirect(new URL("/account/orders", request.url));
  }
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login", request.url));
  const order = await getOrderForUser(reference);
  if (!order) return NextResponse.redirect(new URL("/account/orders", request.url));
  if (order.paymentStatus === "paid") {
    return NextResponse.redirect(new URL(`/account/orders/${reference}`, request.url));
  }
  if (!PAYSTACK_SECRET) {
    return NextResponse.redirect(new URL(`/account/orders/${reference}`, request.url));
  }
  let data: { data?: { status?: string; reference?: string } } = {};
  try {
    const res = await fetchWithTimeout(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
        timeoutMs: PAYSTACK_TIMEOUT_MS,
      }
    );
    data = await res.json().catch(() => ({}));
  } catch {
    await updateOrderPayment(reference, "failed", reference);
    return NextResponse.redirect(new URL(`/account/orders/${reference}`, request.url));
  }
  const success = data.data?.status === "success";
  await updateOrderPayment(reference, success ? "paid" : "failed", data.data?.reference ?? reference);
  return NextResponse.redirect(new URL(`/account/orders/${reference}`, request.url));
}
