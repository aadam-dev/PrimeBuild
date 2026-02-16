"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform } from "framer-motion";
import {
  Search,
  ArrowRight,
  Package,
  Box,
  Layers,
  Wrench,
  Zap,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  "50 bags of Ghacem Cement",
  "Y16 Steel Rebar",
  "Aluzinc Roofing Sheets",
  "PVC Pipes 4 inch",
  "Hollow Blocks 6 inch",
  "Diamond Cement 42.5N",
];

const floatingIcons = [
  { Icon: Box, x: "15%", y: "20%", delay: 0 },
  { Icon: Layers, x: "80%", y: "15%", delay: 0.2 },
  { Icon: Wrench, x: "70%", y: "70%", delay: 0.4 },
  { Icon: Shield, x: "20%", y: "75%", delay: 0.6 },
  { Icon: Zap, x: "85%", y: "45%", delay: 0.8 },
  { Icon: Package, x: "10%", y: "50%", delay: 1 },
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      router.push(`/categories?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section
      className="relative overflow-hidden bg-slate-950 min-h-[85vh] flex items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Gradient Mesh Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Floating Construction Icons */}
      {floatingIcons.map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ delay: delay + 0.5, duration: 0.6, type: "spring" }}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Icon className="h-10 w-10 text-amber-500" />
          </motion.div>
        </motion.div>
      ))}

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative mx-auto px-4 lg:px-8 py-20 lg:py-0">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Content */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-500 border border-amber-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                Trusted by 500+ contractors in Ghana
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Build with{" "}
              <span className="text-amber-500">Precision.</span>
              <br />
              Source with{" "}
              <span className="relative">
                Prime
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="oklch(0.82 0.17 80)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg text-slate-400 leading-relaxed max-w-lg"
            >
              The procurement command center for contractors. Generate formal
              proformas, get stakeholder approval in one click, and track
              deliveries to your site.
            </motion.p>

            {/* Command-Line Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 relative"
            >
              <div
                className={`flex items-center gap-3 rounded-2xl border-2 bg-slate-900/80 px-5 py-4 transition-all ${
                  focused
                    ? "border-amber-500 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]"
                    : "border-slate-700/50"
                }`}
              >
                <Search className="h-5 w-5 text-slate-500 shrink-0" />
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-amber-500 font-mono text-sm select-none">$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => setFocused(false), 200)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
                    placeholder='Search "50 bags of Ghacem"'
                    className="flex-1 bg-transparent text-white placeholder:text-slate-600 outline-none text-sm font-mono"
                  />
                </div>
                <Button
                  size="sm"
                  className="rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 font-semibold px-5"
                  onClick={() => handleSearch(query)}
                >
                  Search
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Auto-suggest Dropdown */}
              {focused && query.length > 0 && filtered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full mt-2 w-full rounded-xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl p-2 shadow-xl z-10"
                >
                  {filtered.map((item) => (
                    <button
                      key={item}
                      onMouseDown={() => {
                        setQuery(item);
                        handleSearch(item);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                    >
                      <Search className="h-3.5 w-3.5 text-slate-500" />
                      {item}
                    </button>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 grid grid-cols-3 gap-6"
            >
              {[
                { value: "2,500+", label: "Materials" },
                { value: "500+", label: "Contractors" },
                { value: "24h", label: "Delivery" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: 3D-ish Material Stack */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Stacked Cards representing materials */}
              {[
                { name: "Ghacem Cement", qty: "500 bags", color: "from-slate-700 to-slate-800", rotate: -6, y: 0 },
                { name: "Y16 Rebar", qty: "200 pcs", color: "from-slate-600 to-slate-700", rotate: -3, y: -20 },
                { name: "Aluzinc Sheets", qty: "150m", color: "from-amber-600 to-amber-700", rotate: 0, y: -40 },
              ].map((item, i) => (
                <motion.div
                  key={item.name}
                  className={`absolute inset-x-0 mx-auto w-80 rounded-2xl bg-gradient-to-br ${item.color} p-8 shadow-2xl border border-white/10`}
                  style={{
                    top: `${30 + i * 8}%`,
                  }}
                  initial={{ opacity: 0, y: 50, rotate: item.rotate }}
                  animate={{
                    opacity: 1,
                    y: item.y,
                    rotate: item.rotate,
                  }}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring", bounce: 0.3 }}
                  whileHover={{
                    y: item.y - 10,
                    scale: 1.02,
                    rotate: 0,
                    transition: { duration: 0.3 },
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">{item.name}</p>
                      <p className="text-white/60 text-sm mt-1">{item.qty}</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-white/80" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-1 flex-1 rounded-full bg-white/20">
                      <div
                        className="h-1 rounded-full bg-amber-500"
                        style={{ width: `${60 + i * 15}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/50">In Stock</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
