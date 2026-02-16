import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { APP_NAME, CONTACT } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";

const footerLinks = {
  Platform: [
    { label: "Catalog", href: "/categories" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "For Suppliers", href: "/supplier" },
  ],
  Resources: [
    { label: "Help Center", href: "/help" },
    { label: "API Docs", href: "/docs/api" },
    { label: "Blog", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.76a8.26 8.26 0 0 0 4.76 1.51v-3.4a4.85 4.85 0 0 1-1-.18z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Facebook", href: CONTACT.social.facebook, icon: Facebook },
  { label: "Instagram", href: CONTACT.social.instagram, icon: Instagram },
  { label: "X", href: CONTACT.social.twitter, icon: XIcon },
  { label: "LinkedIn", href: CONTACT.social.linkedin, icon: Linkedin },
  { label: "YouTube", href: CONTACT.social.youtube, icon: Youtube },
  { label: "TikTok", href: CONTACT.social.tiktok, icon: TikTokIcon },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200/60 bg-slate-950">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo href="/" variant="default" size="sm" />
            <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-xs">
              The procurement command center for Ghanaian contractors. Source
              materials, generate proformas, and track deliveries — all in one
              place.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800/50 text-slate-500 transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <link.icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-[-2px] transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-800 py-6 md:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            Built for Ghana.
          </p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
