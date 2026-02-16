"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Wrench, Zap, Home, PaintBucket, Box, Grid3X3, Cable } from "lucide-react";
import type { Category } from "@/lib/database.types";

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "cement": Layers,
  "steel-rebar": Grid3X3,
  "roofing": Home,
  "plumbing": Wrench,
  "electrical": Zap,
  "hardware": Wrench,
  "blocks-bricks": Box,
  "paint-finishes": PaintBucket,
};

const categoryColorMap: Record<string, string> = {
  "cement": "from-slate-100 to-slate-200 group-hover:from-slate-200 group-hover:to-slate-300",
  "steel-rebar": "from-zinc-100 to-zinc-200 group-hover:from-zinc-200 group-hover:to-zinc-300",
  "roofing": "from-amber-50 to-amber-100 group-hover:from-amber-100 group-hover:to-amber-200",
  "plumbing": "from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200",
  "electrical": "from-yellow-50 to-yellow-100 group-hover:from-yellow-100 group-hover:to-yellow-200",
  "hardware": "from-stone-100 to-stone-200 group-hover:from-stone-200 group-hover:to-stone-300",
  "blocks-bricks": "from-orange-50 to-orange-100 group-hover:from-orange-100 group-hover:to-orange-200",
  "paint-finishes": "from-violet-50 to-violet-100 group-hover:from-violet-100 group-hover:to-violet-200",
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } },
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest text-amber-600"
            >
              Browse Materials
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl"
            >
              Shop by Category
            </motion.h2>
          </div>
          <Link
            href="/categories"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {categories.map((cat, i) => {
            const Icon = categoryIconMap[cat.slug] || Box;
            const colors = categoryColorMap[cat.slug] || "from-slate-100 to-slate-200";
            const isLarge = i === 0 || i === 3;

            return (
              <motion.div
                key={cat.id}
                variants={item}
                className={`${isLarge ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <Link
                  href={`/categories/${cat.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-200/50 hover:-translate-y-1"
                >
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors} transition-colors`}
                  >
                    <Icon className="h-6 w-6 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {cat.name}
                  </h3>
                  {cat.description && (
                    <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-amber-600 opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">
                    Browse <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
