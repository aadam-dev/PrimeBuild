"use client";

import { Truck, TrendingUp, Package, CheckCircle } from "lucide-react";
import { liveTicker } from "@/lib/mock-data";

const icons = [Truck, TrendingUp, Package, CheckCircle];

export function LiveTicker() {
  const doubled = [...liveTicker, ...liveTicker];

  return (
    <div className="relative border-y border-slate-200/60 bg-white overflow-hidden py-3">
      <div className="flex animate-ticker">
        {doubled.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={`${item}-${i}`}
              className="flex items-center gap-2 whitespace-nowrap px-8"
            >
              <Icon className="h-3.5 w-3.5 text-amber-500 shrink-0" />
              <span className="text-xs font-medium text-slate-600">{item}</span>
              <span className="text-slate-300 mx-4">|</span>
            </div>
          );
        })}
      </div>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
    </div>
  );
}
