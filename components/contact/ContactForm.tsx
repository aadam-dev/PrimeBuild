"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  submitContactForm,
  type ContactFormState,
} from "@/lib/actions/contact";

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactFormState, FormData>(
    submitContactForm,
    null
  );

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 mb-4">
          <CheckCircle2 className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-950">Message sent!</h3>
        <p className="mt-2 text-sm text-slate-600">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state?.ok === false && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {state.message}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700">
            Full name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Kwame Asante"
            required
            className="rounded-xl border-slate-200 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company" className="text-slate-700">
            Company{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="company"
            name="company"
            placeholder="Asante Construction Ltd"
            className="rounded-xl border-slate-200 h-11"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="rounded-xl border-slate-200 h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-slate-700">
            Phone
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+233 ..."
            className="rounded-xl border-slate-200 h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject" className="text-slate-700">
          Subject
        </Label>
        <Input
          id="subject"
          name="subject"
          placeholder="Bulk order inquiry"
          className="rounded-xl border-slate-200 h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-slate-700">
          Message <span className="text-red-500">*</span>
        </Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us how we can help..."
          className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full h-11 rounded-xl bg-slate-950 text-white hover:bg-slate-800 font-semibold sm:w-auto sm:px-8"
      >
        {pending ? "Sending..." : "Send Message"}
        {!pending && <ArrowRight className="h-4 w-4 ml-1.5" />}
      </Button>
    </form>
  );
}
