"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Copy, ExternalLink, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SITE_URL } from "@/lib/constants";
import type { ProformaWithItems } from "@/lib/db/queries/proformas";

function getShareUrl(shareToken: string) {
  return `${typeof window !== "undefined" ? window.location.origin : SITE_URL}/share/${shareToken}`;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending Approval",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  approved: {
    label: "Approved",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  declined: {
    label: "Declined",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  converted: {
    label: "Converted",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  expired: {
    label: "Expired",
    className: "border-slate-200 bg-slate-50 text-slate-500",
  },
  draft: {
    label: "Draft",
    className: "border-slate-200 bg-slate-50 text-slate-500",
  },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } },
};

export function ProformasList({
  initialList = [],
}: {
  initialList?: ProformaWithItems[];
}) {
  const list = initialList;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (shareToken: string, id: string) => {
    navigator.clipboard.writeText(getShareUrl(shareToken));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white p-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
          <FileText className="h-8 w-8 text-slate-300" />
        </div>
        <h3 className="mt-6 text-lg font-semibold text-slate-950">
          No proformas yet
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Add materials to your cart and generate your first quote.
        </p>
        <Button
          className="mt-6 rounded-xl bg-slate-950 text-white hover:bg-slate-800"
          asChild
        >
          <Link href="/cart">
            Go to Quote Builder <ArrowRight className="h-4 w-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-3"
    >
      {list.map((p) => {
        const status = statusConfig[p.status] || statusConfig.draft;
        return (
          <motion.div
            key={p.id}
            variants={item}
            className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200/60 bg-white p-5 transition-shadow hover:shadow-sm"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 shrink-0">
              <FileText className="h-5 w-5 text-slate-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-950 font-mono text-sm">
                  {p.proformaNumber}
                </p>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-semibold rounded-md ${status.className}`}
                >
                  {status.label}
                </Badge>
              </div>
              <p className="text-sm text-slate-500 mt-0.5">
                {new Date(p.createdAt).toLocaleDateString("en-GH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                &middot; GH&cent; {Number(p.total).toLocaleString("en-GH")}{" "}
                &middot; {p.items.length} item{p.items.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-slate-200 text-slate-600"
                onClick={() => handleCopy(p.shareToken, p.id)}
              >
                {copiedId === p.id ? (
                  <>
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 mr-1" />
                    Share Link
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-slate-200 text-slate-600"
                asChild
              >
                <Link href={`/account/proformas/${p.id}`}>
                  View <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
