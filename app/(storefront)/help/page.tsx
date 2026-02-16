import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  FileText,
  CreditCard,
  Truck,
  User,
  Shield,
  MessageCircle,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Help Center" };

const categories = [
  {
    icon: ShoppingCart,
    title: "Ordering & Cart",
    questions: [
      {
        q: "How do I add items to my quote?",
        a: 'Browse the catalog, find the material you need, and click "Add to Quote." Adjust quantities in the Quote Builder (cart) before generating a proforma.',
      },
      {
        q: "Can I save my cart for later?",
        a: "If you're signed in, your cart is saved automatically. Guest carts are stored in your browser and persist until you clear your browser data.",
      },
      {
        q: "Is there a minimum order size?",
        a: "There is no minimum order for generating a proforma. However, some delivery options may require a minimum order value of GH¢ 500.",
      },
    ],
  },
  {
    icon: FileText,
    title: "Proformas & Quotes",
    questions: [
      {
        q: "How long are proforma prices valid?",
        a: "Prices are locked for 7 days from the date the proforma is generated. After expiry, you can generate a new proforma with updated pricing.",
      },
      {
        q: "How do I share a proforma for approval?",
        a: 'Go to My Proformas, click "Share Link," and send the URL to your stakeholder. They can approve or decline without creating an account.',
      },
      {
        q: "Can I edit a proforma after generating it?",
        a: "Proformas cannot be edited once issued. If you need changes, generate a new proforma from your cart with the updated quantities.",
      },
      {
        q: "How do I download a proforma as PDF?",
        a: "Open the proforma detail page and click the \"PDF\" button in the top-right corner. The PDF is formatted for printing and sharing.",
      },
    ],
  },
  {
    icon: CreditCard,
    title: "Payments",
    questions: [
      {
        q: "What payment methods are accepted?",
        a: "We accept Mobile Money (MTN, Vodafone, AirtelTigo), Visa/Mastercard debit and credit cards, and bank transfers — all processed securely through Paystack.",
      },
      {
        q: "Can I pay on delivery?",
        a: "Payment on delivery is available for Professional and Enterprise plan holders with an established account history. Contact us to set this up.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed by Paystack, a PCI-DSS compliant payment provider. We never store your card details on our servers.",
      },
    ],
  },
  {
    icon: Truck,
    title: "Delivery & Fulfillment",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Most orders in Accra and Kumasi are fulfilled within 24 hours. Takoradi and other regions typically take 48–72 hours depending on material availability.",
      },
      {
        q: "How do I track my delivery?",
        a: "Go to My Orders and click on any order to see the delivery timeline. You'll also receive WhatsApp updates at each stage: Confirmed → With Supplier → En Route → Delivered.",
      },
      {
        q: "What if materials are damaged on delivery?",
        a: "Inspect all materials upon delivery. If you find damage, refuse the affected items and contact us immediately via WhatsApp. We'll arrange a replacement.",
      },
    ],
  },
  {
    icon: User,
    title: "Account & Profile",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click \"Get Started\" on the homepage or go to the registration page. You'll need your name, email, and a password. Verification is sent to your email.",
      },
      {
        q: "I forgot my password — how do I reset it?",
        a: "Click \"Forgot password?\" on the login page. Enter your email and we'll send a reset link. The link expires after 1 hour.",
      },
      {
        q: "Can I add team members to my account?",
        a: "Team member accounts are available on Professional and Enterprise plans. Contact us to set up your team.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Suppliers & Trust",
    questions: [
      {
        q: "How are suppliers vetted?",
        a: "Every supplier goes through our verification process: business registration check, quality sample review, and a trial fulfillment period before being listed on the platform.",
      },
      {
        q: "I'm a supplier — how do I join?",
        a: "We're always looking for quality suppliers. Visit our Supplier page or contact us at primebuild@gmail.com with your business details.",
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-slate-200/60 bg-white">
        <div className="container mx-auto px-4 lg:px-8 py-16 lg:py-24 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
              <HelpCircle className="h-7 w-7 text-amber-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            Help Center
          </h1>
          <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
            Find answers to common questions about ordering, proformas,
            payments, delivery, and more.
          </p>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <div className="space-y-12">
            {categories.map((cat) => (
              <div key={cat.title}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                    <cat.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {cat.title}
                  </h2>
                </div>
                <div className="divide-y divide-slate-200/60 rounded-2xl border border-slate-200/60 bg-white">
                  {cat.questions.map((faq) => (
                    <div key={faq.q} className="px-6 py-5">
                      <h3 className="font-semibold text-slate-950">{faq.q}</h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still need help */}
      <section className="border-t border-slate-200/60 bg-slate-950">
        <div className="container mx-auto px-4 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-white">
            Still need help?
          </h2>
          <p className="mt-3 text-slate-400 max-w-lg mx-auto">
            Our support team is available Monday through Saturday. Reach out via
            WhatsApp for the fastest response.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button
              className="rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 font-semibold px-8"
              asChild
            >
              <a
                href="https://wa.me/233559602056"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="h-4 w-4 mr-1.5" />
                WhatsApp Support
              </a>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-medium px-8"
              asChild
            >
              <Link href="/contact">
                Contact Form <ArrowRight className="h-4 w-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
