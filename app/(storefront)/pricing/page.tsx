import type { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Zap,
  Building,
  Crown,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Pricing" };

const plans = [
  {
    name: "Starter",
    description: "For individual contractors and small projects.",
    price: "Free",
    priceSub: "No hidden fees",
    icon: Zap,
    cta: "Get Started",
    ctaHref: "/register",
    highlight: false,
    features: [
      "Browse full catalog",
      "Generate up to 5 proformas/month",
      "7-day price lock",
      "WhatsApp delivery updates",
      "Stakeholder approval links",
      "PDF proforma downloads",
    ],
  },
  {
    name: "Professional",
    description: "For growing construction firms managing multiple sites.",
    price: "GH¢ 299",
    priceSub: "/month",
    icon: Building,
    cta: "Start Free Trial",
    ctaHref: "/register",
    highlight: true,
    features: [
      "Everything in Starter",
      "Unlimited proformas",
      "Project-based dashboard",
      "Priority fulfillment (same-day Accra)",
      "Dedicated account manager",
      "Bulk discount tiers",
      "Order history & analytics",
      "Team member accounts (up to 5)",
    ],
  },
  {
    name: "Enterprise",
    description: "For large firms with high-volume procurement needs.",
    price: "Custom",
    priceSub: "Tailored to your volume",
    icon: Crown,
    cta: "Contact Sales",
    ctaHref: "/contact",
    highlight: false,
    features: [
      "Everything in Professional",
      "Unlimited team members",
      "Custom payment terms (Net 30/60)",
      "API access for ERP integration",
      "Dedicated supplier pool",
      "SLA-backed delivery guarantees",
      "Quarterly business reviews",
      "White-label proformas",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-600">
            Pricing
          </span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Start free and scale as your business grows. Every plan includes
            wholesale material pricing and our full procurement workflow.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 lg:py-28 bg-slate-50/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.highlight
                    ? "border-amber-500 bg-white shadow-xl shadow-amber-500/10 ring-1 ring-amber-500"
                    : "border-slate-200/60 bg-white"
                }`}
              >
                {plan.highlight && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 hover:bg-amber-500 font-bold px-4">
                    Most Popular
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      plan.highlight
                        ? "bg-amber-500 text-slate-950"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <plan.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-950">{plan.name}</h3>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-950">
                    {plan.price}
                  </span>
                  <span className="text-sm text-slate-500 ml-1">
                    {plan.priceSub}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-slate-600"
                    >
                      <Check className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full rounded-xl font-semibold ${
                    plan.highlight
                      ? "bg-amber-500 text-slate-950 hover:bg-amber-400"
                      : "bg-slate-950 text-white hover:bg-slate-800"
                  }`}
                  asChild
                >
                  <Link href={plan.ctaHref}>
                    {plan.cta}
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-950 text-center">
            Pricing Questions
          </h2>
          <div className="mt-10 divide-y divide-slate-200/60">
            {[
              {
                q: "Are material prices the same across plans?",
                a: "Yes. All plans access the same wholesale catalog. Professional and Enterprise plans unlock additional bulk discount tiers on high-volume orders.",
              },
              {
                q: "Can I change plans later?",
                a: "Absolutely. Upgrade or downgrade at any time. Changes take effect at your next billing cycle.",
              },
              {
                q: "Is there a long-term commitment?",
                a: "No. All plans are month-to-month. Cancel anytime with no penalties.",
              },
              {
                q: "What does 'Priority Fulfillment' mean?",
                a: "Professional and Enterprise orders are processed first. In Accra, this means same-day dispatch for orders placed before 10 AM.",
              },
            ].map((faq) => (
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
            Not sure which plan?
          </h2>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            Start free — no credit card required. Upgrade when you need more.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button
              className="rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-8"
              asChild
            >
              <Link href="/register">
                Start Free <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-medium px-8"
              asChild
            >
              <Link href="/contact">
                <MessageCircle className="h-4 w-4 mr-1.5" />
                Talk to Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
