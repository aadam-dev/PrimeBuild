"use client";

import { motion } from "framer-motion";
import { FileText, Users, Truck, Shield, Clock, Headphones } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Formal Proformas",
    description:
      "Generate professional proforma invoices with your project details. Locked pricing for 7 days.",
  },
  {
    icon: Users,
    title: "One-Click Approval",
    description:
      "Share quotes with stakeholders. They approve or decline with a single click — no account needed.",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    description:
      "Track your materials from supplier warehouse to your site. Real-time updates via WhatsApp.",
  },
  {
    icon: Shield,
    title: "Verified Suppliers",
    description:
      "Every supplier is vetted. Quality materials at wholesale prices with guaranteed stock.",
  },
  {
    icon: Clock,
    title: "24-Hour Fulfillment",
    description:
      "Most orders fulfilled within 24 hours. Accra, Kumasi, Takoradi, and expanding.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Direct WhatsApp line to your procurement coordinator. Human support, always.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } },
};

export function WhyPrimeBuild() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest text-amber-600"
          >
            Why Prime Build
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
          >
            Your Procurement Command Center
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Everything a contractor needs to source materials efficiently,
            manage approvals, and track deliveries — in one platform.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group relative rounded-2xl border border-slate-200/60 bg-white p-7 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 transition-colors group-hover:bg-amber-500/20">
                <feature.icon className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-950">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
