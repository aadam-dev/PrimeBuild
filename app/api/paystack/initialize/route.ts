import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { getOrderForUser } from "@/lib/actions/orders";
import { getUserEmail } from "@/lib/db/queries/user";
import { SITE_URL } from "@/lib/constants";
import { isUuid } from "@/lib/validation";
import { fetchWithTimeout } from "@/lib/fetch-with-timeout";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_URL = "https://api.paystack.co/transaction/initialize";
const PAYSTACK_TIMEOUT_MS = 15_000;

export async function POST(request: Request) {
  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: "Paystack not configured" }, { status: 503 });
  }
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const orderId = body.orderId as string | undefined;
  if (!orderId || !isUuid(orderId)) return NextResponse.json({ error: "Valid orderId required" }, { status: 400 });
  const order = await getOrderForUser(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  const email = await getUserEmail(session.user.id);
  if (!email) return NextResponse.json({ error: "User email not found" }, { status: 400 });
  const amount = Math.round(Number(order.total) * 100);
  if (amount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  let res: Response;
  try {
    res = await fetchWithTimeout(PAYSTACK_URL, {
      method: "POST",
      timeoutMs: PAYSTACK_TIMEOUT_MS,
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount,
        reference: orderId,
        callback_url: `${SITE_URL}/api/paystack/verify?reference=${orderId}`,
      }),
    });
  } catch (e) {
    const message = e instanceof Error && e.name === "AbortError" ? "Payment provider timeout" : "Payment provider unavailable";
    return NextResponse.json({ error: message }, { status: 502 });
  }
  const data = await res.json().catch(() => ({}));
  if (!data.status || !data.data?.authorization_url) {
    return NextResponse.json({ error: data.message ?? "Paystack init failed" }, { status: 502 });
  }
  return NextResponse.json({
    authorization_url: data.data.authorization_url,
    reference: data.data.reference,
  });
}
