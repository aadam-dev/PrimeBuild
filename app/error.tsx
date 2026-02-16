"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to your monitoring service in production (avoid logging full error to console in prod)
    if (process.env.NODE_ENV === "development") {
      console.error("Route error:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-slate-200/60 bg-white p-8 shadow-sm text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-950">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-500">
          We couldn’t complete your request. Please try again.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={reset} variant="default" className="rounded-xl">
            Try again
          </Button>
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
