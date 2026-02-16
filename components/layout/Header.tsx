"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  ChevronDown,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/ui/Logo";
import { useCartCount } from "@/lib/hooks/use-cart";
import { authClient } from "@/lib/auth-client";

const CART_UPDATED_EVENT = "primebuild-cart-updated";

function useCartCountHeader() {
  const { data: session } = authClient.useSession();
  const localCount = useCartCount();
  const [serverCount, setServerCount] = useState(0);
  const fetchCount = useCallback(async () => {
    if (!session?.user) return;
    const res = await fetch("/api/cart");
    const data = await res.json();
    const count = (data.entries ?? []).reduce(
      (s: number, e: { quantity: number }) => s + e.quantity,
      0
    );
    setServerCount(count);
  }, [session?.user]);
  useEffect(() => {
    if (session?.user) {
      fetchCount();
      const onUpdate = () => fetchCount();
      window.addEventListener(CART_UPDATED_EVENT, onUpdate);
      return () => window.removeEventListener(CART_UPDATED_EVENT, onUpdate);
    }
  }, [session?.user, fetchCount]);
  return session?.user ? serverCount : localCount;
}

const navLinks = [
  { href: "/categories", label: "Catalog" },
  { href: "/account/proformas", label: "Proformas" },
  { href: "/account/orders", label: "Orders" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const count = useCartCountHeader();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "glass-nav border-b border-slate-200/60 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 lg:px-8">
          {/* Logo */}
          <Logo href="/" variant="dark" size="sm" />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
                    isActive
                      ? "text-slate-950"
                      : "text-slate-500 hover:text-slate-950 hover:bg-slate-100/60"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-x-1 -bottom-[1px] h-0.5 rounded-full bg-amber-500"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl hover:bg-slate-100/60"
              asChild
            >
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5 text-slate-600" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950"
                    >
                      {count > 99 ? "99+" : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </Button>

            {/* User Menu */}
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="gap-2 rounded-xl px-3 hover:bg-slate-100/60"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-bold text-amber-500">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="gap-2">
                      <User className="h-4 w-4" /> Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders" className="gap-2">
                      <Truck className="h-4 w-4" /> My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="gap-2">
                      <LayoutDashboard className="h-4 w-4" /> Admin
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2 text-red-600">
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl text-slate-600 hover:bg-slate-100/60"
                  asChild
                >
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-xl bg-slate-950 text-white hover:bg-slate-800"
                  asChild
                >
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 glass-nav border-b border-slate-200/60 p-4 md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100/60"
                >
                  {link.label}
                </Link>
              ))}
              {!session && (
                <>
                  <div className="my-2 h-px bg-slate-200/60" />
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100/60"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-medium text-white"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
