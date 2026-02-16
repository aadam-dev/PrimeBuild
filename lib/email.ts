import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.RESEND_FROM_EMAIL ?? "Prime Build <onboarding@resend.dev>";

export async function sendProformaShared(params: {
  to: string;
  proformaNumber: string;
  shareUrl: string;
}) {
  if (!resend) return { ok: false as const };
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Proforma ${params.proformaNumber} shared`,
    html: `Your proforma <strong>${params.proformaNumber}</strong> has been created. Share this link for approval: <a href="${params.shareUrl}">${params.shareUrl}</a>`,
  });
  return { ok: !error };
}

export async function sendProformaApproved(params: {
  to: string;
  proformaNumber: string;
  actorName?: string | null;
  comment?: string | null;
}) {
  if (!resend) return { ok: false as const };
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Proforma ${params.proformaNumber} approved`,
    html: `Your proforma <strong>${params.proformaNumber}</strong> has been approved.${params.actorName ? ` By: ${params.actorName}` : ""}${params.comment ? `<br/><br/>Comment: ${params.comment}` : ""}`,
  });
  return { ok: !error };
}

export async function sendProformaDeclined(params: {
  to: string;
  proformaNumber: string;
  actorName?: string | null;
  comment?: string | null;
}) {
  if (!resend) return { ok: false as const };
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Proforma ${params.proformaNumber} declined`,
    html: `Your proforma <strong>${params.proformaNumber}</strong> has been declined.${params.actorName ? ` By: ${params.actorName}` : ""}${params.comment ? `<br/><br/>Comment: ${params.comment}` : ""}`,
  });
  return { ok: !error };
}

export async function sendOrderConfirmed(params: {
  to: string;
  orderNumber: string;
  total: number;
}) {
  if (!resend) return { ok: false as const };
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: `Order ${params.orderNumber} confirmed`,
    html: `Your order <strong>${params.orderNumber}</strong> has been confirmed. Total: GH¢ ${params.total.toLocaleString("en-GH")}.`,
  });
  return { ok: !error };
}

export async function sendResetPassword(params: { to: string; url: string; user: { name: string } }) {
  if (!resend) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false as const };
    }
    console.log("[Prime Build] Reset password link (no RESEND_API_KEY):", params.url);
    return { ok: true as const };
  }
  const { error } = await resend.emails.send({
    from,
    to: params.to,
    subject: "Reset your Prime Build password",
    html: `Hi ${params.user.name || "there"},<br/><br/>Click the link below to reset your password:<br/><a href="${params.url}">${params.url}</a><br/><br/>This link expires in 1 hour. If you didn't request this, you can ignore this email.<br/><br/>— Prime Build`,
  });
  return { ok: !error };
}
