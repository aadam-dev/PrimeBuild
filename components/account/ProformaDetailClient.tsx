"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Copy,
  Check,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  ChevronRight,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SITE_URL, PROFORMA_VALIDITY_DAYS } from "@/lib/constants";
import { createOrderFromProformaAction } from "@/lib/actions/orders";
import type { ProformaWithItems } from "@/lib/db/queries/proformas";

function getShareUrl(shareToken: string) {
  return `${typeof window !== "undefined" ? window.location.origin : SITE_URL}/share/${shareToken}`;
}

function getDaysRemaining(validUntil: string | Date) {
  const now = new Date();
  const end = new Date(validUntil);
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

const statusConfig: Record<
  string,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  pending: {
    label: "Pending Approval",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  declined: {
    label: "Declined",
    className: "border-red-200 bg-red-50 text-red-700",
    icon: XCircle,
  },
  converted: {
    label: "Converted to Order",
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: Package,
  },
  expired: {
    label: "Expired",
    className: "border-slate-200 bg-slate-50 text-slate-500",
    icon: Clock,
  },
  draft: {
    label: "Draft",
    className: "border-slate-200 bg-slate-50 text-slate-500",
    icon: FileText,
  },
};

const proformaSteps = [
  { key: "created", label: "Created" },
  { key: "shared", label: "Shared" },
  { key: "approved", label: "Approved" },
  { key: "converted", label: "Ordered" },
];

function getStepIndex(status: string) {
  switch (status) {
    case "draft":
      return 0;
    case "pending":
      return 1;
    case "approved":
      return 2;
    case "converted":
      return 3;
    case "declined":
    case "expired":
      return -1;
    default:
      return 0;
  }
}

export function ProformaDetailClient({
  proforma,
}: {
  proforma: ProformaWithItems;
}) {
  const [converting, setConverting] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = getShareUrl(proforma.shareToken);
  const canConvert = proforma.status === "approved";
  const status = statusConfig[proforma.status] || statusConfig.draft;
  const StatusIcon = status.icon;
  const daysRemaining = getDaysRemaining(proforma.validUntil);
  const validityPct = Math.round(
    (daysRemaining / PROFORMA_VALIDITY_DAYS) * 100
  );
  const stepIdx = getStepIndex(proforma.status);

  const handleConvert = async () => {
    setConverting(true);
    const res = await createOrderFromProformaAction(proforma.id);
    setConverting(false);
    if (res.ok && res.orderId) {
      window.location.href = `/account/orders/${res.orderId}`;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-slate-500">
        <Link
          href="/account/proformas"
          className="hover:text-slate-950 transition-colors"
        >
          Proformas
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-slate-950 font-medium">
          {proforma.proformaNumber}
        </span>
      </nav>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden"
      >
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <FileText className="h-6 w-6 text-slate-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-950 font-mono">
                  {proforma.proformaNumber}
                </h1>
                <Badge
                  variant="outline"
                  className={`text-xs font-semibold rounded-lg ${status.className}`}
                >
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                Created{" "}
                {new Date(proforma.createdAt).toLocaleDateString("en-GH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-200"
              asChild
            >
              <a
                href={`/api/proformas/${proforma.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4 mr-1.5" />
                PDF
              </a>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-slate-200"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5 text-emerald-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1.5" />
                  Share Link
                </>
              )}
            </Button>
            {canConvert && (
              <Button
                size="sm"
                onClick={handleConvert}
                disabled={converting}
                className="rounded-lg bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold"
              >
                {converting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    Convert to Order
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Progress Stepper */}
        {stepIdx >= 0 && (
          <div className="border-t border-slate-200/60 px-6 py-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              {proformaSteps.map((step, i) => {
                const isComplete = i <= stepIdx;
                const isCurrent = i === stepIdx;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          isComplete
                            ? "bg-amber-500 text-slate-950"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {isComplete ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          isCurrent
                            ? "text-slate-950"
                            : isComplete
                            ? "text-slate-600"
                            : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < proformaSteps.length - 1 && (
                      <div
                        className={`mx-3 h-0.5 flex-1 rounded-full ${
                          i < stepIdx ? "bg-amber-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Validity Timer */}
        {proforma.status === "pending" && (
          <div className="px-6 py-3 bg-amber-50 border-t border-amber-100">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-900">
                  Price lock: {daysRemaining} day
                  {daysRemaining !== 1 ? "s" : ""} remaining
                </span>
              </div>
              <span className="text-xs text-amber-600">
                Expires{" "}
                {new Date(proforma.validUntil).toLocaleDateString("en-GH")}
              </span>
            </div>
            <Progress value={validityPct} className="h-1.5 bg-amber-200" />
          </div>
        )}
      </motion.div>

      {/* Document Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-slate-200/60 bg-white overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200/60">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Line Items
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/60 text-left text-xs text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 font-medium">Material</th>
                <th className="px-6 py-3 font-medium text-center">Qty</th>
                <th className="px-6 py-3 font-medium text-right">
                  Unit Price
                </th>
                <th className="px-6 py-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {proforma.items.map((item, i) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.04 }}
                  className="hover:bg-slate-50/50"
                >
                  <td className="px-6 py-4 font-medium text-slate-950">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-600">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-600">
                    GH&cent; {item.unitPrice.toLocaleString("en-GH")}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-950">
                    GH&cent; {item.lineTotal.toLocaleString("en-GH")}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-5 bg-slate-50 border-t border-slate-200/60">
          <div className="flex items-center justify-end gap-6">
            <span className="text-sm text-slate-500">Grand Total</span>
            <span className="text-2xl font-bold text-slate-950">
              GH&cent; {Number(proforma.total).toLocaleString("en-GH")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Share CTA */}
      {proforma.status === "pending" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-amber-900">
                Waiting for approval?
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Share this link with your client or project manager. They can
                approve with a single click — no login required.
              </p>
            </div>
            <Button
              onClick={handleCopy}
              className="rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold shrink-0"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Link Copied!
                </>
              ) : (
                <>
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  Copy Approval Link
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
