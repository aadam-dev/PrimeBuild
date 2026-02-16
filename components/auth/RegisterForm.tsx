"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const name = (form.elements.namedItem("full_name") as HTMLInputElement)
      .value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    setLoading(true);
    const res = await authClient.signUp.email({
      email,
      password,
      name: name?.trim() ?? "",
    });
    setLoading(false);
    if (res.error) {
      setError(res.error.message ?? "Sign up failed");
      return;
    }
    router.push("/login?message=Check your email to confirm your account.");
    router.refresh();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-950">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">
        Join 500+ contractors sourcing smarter with Prime Build
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-slate-700">
            Full name
          </Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Kwame Asante"
            autoComplete="name"
            className="rounded-xl border-slate-200 h-11"
          />
        </div>

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
          <Label htmlFor="phone" className="text-slate-700">
            Phone{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+233 ..."
            autoComplete="tel"
            className="rounded-xl border-slate-200 h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            className="rounded-xl border-slate-200 h-11"
          />
          <p className="text-xs text-slate-400">Minimum 6 characters</p>
        </div>

        <Button
          type="submit"
          className="w-full h-11 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              Creating account...
            </>
          ) : (
            "Get Started"
          )}
        </Button>

        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-slate-950 hover:text-amber-600 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
