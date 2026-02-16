"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, FileText, Truck, Settings } from "lucide-react";

const links = [
  { href: "/account", label: "Overview", icon: LayoutGrid, exact: true },
  { href: "/account/proformas", label: "Proformas", icon: FileText, exact: false },
  { href: "/account/orders", label: "Orders", icon: Truck, exact: false },
  { href: "/account/settings", label: "Settings", icon: Settings, exact: false },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="container mx-auto px-4 lg:px-8">
      <div className="flex gap-1 -mb-px">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-slate-950"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
              {isActive && (
                <motion.div
                  layoutId="account-tab-indicator"
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-amber-500"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
