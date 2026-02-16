"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordConfirmForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (errorParam === "INVALID_TOKEN" || !token) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Invalid or expired link</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            This reset link is invalid or has expired. Request a new one below.
          </p>
        </div>
        <Link
          href="/reset-password"
          className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
        >
          Request new reset link
        </Link>
        <Link
          href="/login"
          className="block text-sm text-slate-500 hover:text-slate-950 transition-colors"
        >
          <ArrowLeft className="inline h-3.5 w-3.5 mr-1" />
          Back to sign in
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) return;
    const form = e.currentTarget;
    const newPassword = (form.querySelector('[name="newPassword"]') as HTMLInputElement)?.value;
    if (!newPassword || newPassword.length < 8) {
      setMessage("Password must be at least 8 characters.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setMessage("");
    const { error } = await authClient.resetPassword({ newPassword, token });
    if (error) {
      setStatus("error");
      setMessage(error.message ?? "Failed to reset password. The link may have expired.");
      return;
    }
    setStatus("success");
    setMessage("Your password has been updated. You can sign in with your new password.");
  }

  if (status === "success") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">Password updated</h1>
          <p className="mt-1.5 text-sm text-slate-500">{message}</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-950 bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl transition-colors"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Set new password</h1>
        <p className="mt-1.5 text-sm text-slate-500">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-slate-700">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              minLength={8}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="h-11 rounded-xl border-slate-200 pl-10"
            />
          </div>
        </div>
        {message && (
          <p className={`text-sm ${status === "error" ? "text-red-600" : "text-slate-500"}`}>{message}</p>
        )}
        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-semibold"
        >
          {status === "loading" ? "Updating…" : "Update password"}
        </Button>
      </form>

      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-950 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}

export default function ResetPasswordConfirmPage() {
  return (
    <Suspense fallback={<p className="text-slate-500">Loading…</p>}>
      <ResetPasswordConfirmForm />
    </Suspense>
  );
}
