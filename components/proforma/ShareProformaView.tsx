"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  FileText,
  Shield,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { APP_NAME, PROFORMA_VALIDITY_DAYS } from "@/lib/constants";
import { approveOrDeclineProformaAction } from "@/lib/actions/proformas";
import type { ProformaWithItems } from "@/lib/db/queries/proformas";

type ProformaForView = ProformaWithItems | null;

function confettiEffect() {
  import("canvas-confetti").then((mod) => {
    const confetti = mod.default;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#f59e0b", "#0f172a", "#e2e8f0", "#fbbf24"],
    });
  });
}

function getDaysRemaining(validUntil: string | Date) {
  const now = new Date();
  const end = new Date(validUntil);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function ShareProformaView({
  token,
  initialProforma,
}: {
  token: string;
  initialProforma: ProformaForView;
}) {
  const [proforma, setProforma] = useState<ProformaForView>(initialProforma);
  const [actionDone, setActionDone] = useState<
    "approved" | "declined" | null
  >(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleApprove = async () => {
    setSubmitting(true);
    const res = await approveOrDeclineProformaAction(token, "approved", {
      comment: comment || undefined,
    });
    setSubmitting(false);
    if (res.ok) {
      setActionDone("approved");
      setProforma((prev) =>
        prev ? { ...prev, status: "approved" } : prev
      );
      confettiEffect();
    }
  };

  const handleDecline = async () => {
    setSubmitting(true);
    const res = await approveOrDeclineProformaAction(token, "declined", {
      comment: comment || undefined,
    });
    setSubmitting(false);
    if (res.ok) {
      setActionDone("declined");
      setProforma((prev) =>
        prev ? { ...prev, status: "declined" } : prev
      );
    }
  };

  if (!proforma) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <AlertTriangle className="h-8 w-8 text-slate-400" />
          </div>
          <h1 className="mt-6 text-xl font-bold text-slate-950">
            Quote Not Found
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            This link may be invalid or the quote may have been removed.
          </p>
        </div>
      </div>
    );
  }

  const isPending = proforma.status === "pending" && !actionDone;
  const daysRemaining = getDaysRemaining(proforma.validUntil);
  const validityPct = Math.round(
    (daysRemaining / PROFORMA_VALIDITY_DAYS) * 100
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Clean branded header */}
      <header className="border-b border-slate-200/60 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950">
              <Package className="h-5 w-5 text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-950 leading-none">
                {APP_NAME}
              </span>
              <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase leading-none mt-0.5">
                Proforma Invoice
              </span>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`rounded-lg px-3 py-1 text-xs font-semibold ${
              proforma.status === "approved" || actionDone === "approved"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : proforma.status === "declined" || actionDone === "declined"
                ? "border-red-200 bg-red-50 text-red-700"
                : proforma.status === "expired"
                ? "border-slate-200 bg-slate-50 text-slate-500"
                : "border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {actionDone || proforma.status}
          </Badge>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Document Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden"
        >
          {/* Quote ID */}
          <div className="px-8 py-6 bg-slate-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                  Quote Reference
                </p>
                <p className="mt-1 text-2xl font-bold text-white font-mono">
                  {proforma.proformaNumber}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">Issued</p>
                <p className="text-sm text-slate-300 font-medium">
                  {new Date(proforma.createdAt).toLocaleDateString("en-GH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Validity Timer */}
          {isPending && (
            <div className="px-8 py-4 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-900">
                    Price lock expires in {daysRemaining} day
                    {daysRemaining !== 1 ? "s" : ""}
                  </span>
                </div>
                <span className="text-xs text-amber-600">
                  Until{" "}
                  {new Date(proforma.validUntil).toLocaleDateString("en-GH")}
                </span>
              </div>
              <Progress value={validityPct} className="h-1.5 bg-amber-200" />
            </div>
          )}

          {/* Items Table */}
          <div className="px-8 py-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Materials
            </h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Item</th>
                  <th className="pb-3 font-medium text-center">Qty</th>
                  <th className="pb-3 font-medium text-right">Unit Price</th>
                  <th className="pb-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {proforma.items.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <td className="py-4">
                      <p className="font-medium text-slate-950">
                        {item.productName}
                      </p>
                    </td>
                    <td className="py-4 text-center text-slate-600">
                      {item.quantity}
                    </td>
                    <td className="py-4 text-right text-slate-600">
                      GH&cent; {item.unitPrice.toLocaleString("en-GH")}
                    </td>
                    <td className="py-4 text-right font-semibold text-slate-950">
                      GH&cent; {item.lineTotal.toLocaleString("en-GH")}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200/60">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-slate-950">
                Grand Total
              </span>
              <span className="text-2xl font-bold text-slate-950">
                GH&cent; {proforma.total.toLocaleString("en-GH")}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <AnimatePresence mode="wait">
          {actionDone === "approved" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
            >
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
              <h3 className="mt-4 text-xl font-bold text-emerald-900">
                Quote Approved
              </h3>
              <p className="mt-2 text-sm text-emerald-700">
                The contractor has been notified via WhatsApp. They can now
                proceed to fulfillment.
              </p>
            </motion.div>
          )}

          {actionDone === "declined" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
            >
              <XCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-xl font-bold text-red-900">
                Quote Declined
              </h3>
              <p className="mt-2 text-sm text-red-700">
                The contractor has been notified. They may reach out to discuss
                alternatives.
              </p>
            </motion.div>
          )}

          {isPending && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              {/* Comment */}
              <div className="rounded-2xl border border-slate-200/60 bg-white p-6">
                <label className="text-sm font-medium text-slate-950">
                  Comment{" "}
                  <span className="text-slate-400 font-normal">
                    (optional)
                  </span>
                </label>
                <Input
                  className="mt-2 rounded-xl border-slate-200"
                  placeholder="Add a note to the contractor..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              {/* Approve / Decline */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleApprove}
                  disabled={submitting}
                  className="flex-1 h-14 rounded-2xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold text-base animate-pulse-ring"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  {submitting ? "Processing..." : "Approve Quote"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  disabled={submitting}
                  className="flex-1 h-14 rounded-2xl border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 font-medium text-base"
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  Decline
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Terms */}
        <div className="mt-8">
          <Accordion type="single" collapsible>
            <AccordionItem
              value="terms"
              className="rounded-2xl border border-slate-200/60 bg-white px-6"
            >
              <AccordionTrigger className="text-sm font-medium text-slate-600 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-400" />
                  Terms & Conditions
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-500 leading-relaxed">
                <ol className="list-decimal list-inside space-y-2">
                  <li>
                    Prices shown are wholesale rates, valid for{" "}
                    {PROFORMA_VALIDITY_DAYS} days from issuance.
                  </li>
                  <li>
                    Approval constitutes authorization for the contractor to
                    proceed with the order.
                  </li>
                  <li>
                    Delivery timelines are estimated. Actual delivery depends on
                    stock and location.
                  </li>
                  <li>
                    Payment is due upon delivery unless otherwise agreed.
                  </li>
                  <li>
                    All materials are subject to availability at the time of
                    order confirmation.
                  </li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-slate-400">
          <p>
            Powered by {APP_NAME} — The Procurement Command Center for Ghanaian
            Contractors
          </p>
        </div>
      </div>
    </div>
  );
}
