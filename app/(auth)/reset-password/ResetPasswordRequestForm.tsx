"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");

export function ResetPasswordRequestForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value?.trim();
    if (!email) return;
    setStatus("loading");
    setMessage("");
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${siteUrl}/reset-password/confirm`,
    });
    if (error) {
      setStatus("error");
      setMessage(error.message ?? "Something went wrong. Please try again.");
      return;
    }
    setStatus("success");
    setMessage(
      "If an account exists for that email, we sent a reset link. Check your inbox."
    );
  }

  if (status === "success") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Check your email
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">{message}</p>
        </div>
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Reset your password
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter your email and we will send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email address
          </Label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              className="h-11 rounded-xl border-slate-200 pl-10"
            />
          </div>
        </div>
        {status === "error" && message && (
          <p className="text-sm text-red-600">{message}</p>
        )}
        <Button
          type="submit"
          disabled={status === "loading"}
          className="w-full h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-semibold"
        >
          {status === "loading" ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-950 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
