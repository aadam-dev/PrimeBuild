"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isSafeRelativePath } from "@/lib/validation";

export function LoginForm({ message }: { message?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl");
  const safeRedirect = callbackUrl && isSafeRelativePath(callbackUrl) ? callbackUrl : "/";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    setLoading(true);
    const res = await authClient.signIn.email({
      email,
      password,
      callbackURL: safeRedirect,
    });
    setLoading(false);
    if (res.error) {
      setError(res.error.message ?? "Sign in failed");
      return;
    }
    router.push(safeRedirect);
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-950">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-500">
        Sign in to your Prime Build account
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {message && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="rounded-xl border-slate-200 h-11"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <Link
              href="/reset-password"
              className="text-xs text-slate-500 hover:text-slate-950 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-xl border-slate-200 h-11"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-slate-950 hover:text-amber-600 transition-colors"
          >
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
