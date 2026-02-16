import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  FileText,
  Share2,
  CheckCircle2,
  CreditCard,
  Truck,
  Package,
  ArrowRight,
  Clock,
  Shield,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "How It Works" };

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Browse & Select Materials",
    description:
      "Search our wholesale catalog of 2,500+ building materials. Filter by category, compare prices, and find exactly what your project needs.",
    detail: "Prices are updated daily and reflect real wholesale rates from verified suppliers across Ghana.",
  },
  {
    number: "02",
    icon: ShoppingCart,
    title: "Build Your Quote",
    description:
      "Add materials to your Quote Builder. Adjust quantities, review line-by-line pricing, and see your total in real-time.",
    detail: "No commitment at this stage — you're simply building a material list for your project.",
  },
  {
    number: "03",
    icon: FileText,
    title: "Generate a Proforma",
    description:
      "With one click, convert your quote into a formal Proforma Invoice. Prices are locked for 7 days so you have time to get approval.",
    detail: "Each proforma gets a unique reference number and can be downloaded as a PDF for your records.",
  },
  {
    number: "04",
    icon: Share2,
    title: "Share for Approval",
    description:
      "Copy the unique approval link and send it to your client, project manager, or finance team. They don't need an account.",
    detail: "Stakeholders see a clean, branded page with just the quote details and an Approve/Decline button.",
  },
  {
    number: "05",
    icon: CheckCircle2,
    title: "One-Click Approval",
    description:
      "Your stakeholder reviews the breakdown and approves with a single click. You're instantly notified via WhatsApp.",
    detail: "Declined? They can add a comment so you know what to adjust. Generate a revised quote in minutes.",
  },
  {
    number: "06",
    icon: CreditCard,
    title: "Pay & Confirm",
    description:
      "Once approved, proceed to checkout. Pay securely via Paystack (mobile money, card, or bank transfer).",
    detail: "Payment on delivery is available for established accounts. Contact us to set this up.",
  },
  {
    number: "07",
    icon: Truck,
    title: "Track Your Delivery",
    description:
      "Follow your order through every stage: Confirmed → With Supplier → En Route → Delivered. Real-time WhatsApp updates.",
    detail: "Most orders in Accra and Kumasi are fulfilled within 24 hours. Other regions within 48–72 hours.",
  },
];

const faqs = [
  {
    q: "Do I need an account to get a quote?",
    a: "You can browse the catalog without an account, but you'll need to sign up (free) to generate a proforma.",
  },
  {
    q: "How long are prices locked?",
    a: "Prices on a proforma are locked for 7 days from the date of issue. After that, a new proforma will reflect current rates.",
  },
  {
    q: "Can my boss approve without creating an account?",
    a: "Yes. The approval link opens a standalone page. No login or signup required — just review and click Approve.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Mobile Money (MTN, Vodafone, AirtelTigo), Visa/Mastercard, and bank transfers via Paystack.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
              How It Works
            </span>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              From search to site delivery in{" "}
              <span className="text-amber-500">7 simple steps</span>
            </h1>
            <p className="mt-4 text-lg text-slate-500 leading-relaxed max-w-2xl">
              Prime Build replaces phone calls, spreadsheets, and guesswork with
              a streamlined digital procurement flow. Here&apos;s exactly how it
              works.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                className="rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-6"
                asChild
              >
                <Link href="/register">
                  Get Started Free <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-xl border-slate-200 font-medium px-6"
                asChild
              >
                <Link href="/categories">Browse Catalog</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-0">
            {steps.map((step, i) => (
              <div key={step.number} className="relative flex gap-6 pb-12 last:pb-0">
                {/* Vertical Line */}
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold text-sm">
                    <step.icon className="h-6 w-6" />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-0.5 flex-1 mt-3 bg-slate-200" />
                  )}
                </div>

                {/* Content */}
                <div className="pt-1 pb-6">
                  <span className="text-xs font-bold text-amber-600 tracking-wider">
                    STEP {step.number}
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-slate-950">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-slate-200/60 bg-slate-50/50">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              { icon: Clock, label: "24-Hour Delivery", sub: "Accra & Kumasi" },
              { icon: Shield, label: "7-Day Price Lock", sub: "On every proforma" },
              { icon: Users, label: "500+ Contractors", sub: "Trust Prime Build" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
                  <item.icon className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{item.label}</p>
                  <p className="text-sm text-slate-500">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-950">
            Frequently Asked Questions
          </h2>
          <div className="mt-8 divide-y divide-slate-200/60">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-6">
                <h3 className="font-semibold text-slate-950">{faq.q}</h3>
                <p className="mt-2 text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200/60 bg-slate-950">
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to streamline your procurement?
          </h2>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            Create a free account and generate your first proforma in under 5
            minutes.
          </p>
          <Button
            className="mt-6 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-8"
            asChild
          >
            <Link href="/register">
              Get Started <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
