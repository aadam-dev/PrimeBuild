"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-t border-slate-200/60">
      <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-slate-950 p-10 md:p-16 lg:p-20"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-amber-500/5 rounded-full blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20">
              <Package className="h-8 w-8 text-amber-500" />
            </div>

            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl max-w-2xl">
              Ready to streamline your procurement?
            </h2>

            <p className="mt-4 text-lg text-slate-400 max-w-xl">
              Join hundreds of contractors across Ghana who source smarter with
              Prime Build.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-8 text-base animate-pulse-ring"
                asChild
              >
                <Link href="/register">
                  Start Building
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-medium px-8 text-base"
                asChild
              >
                <Link href="/categories">Browse Catalog</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
