import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 relative flex-col justify-between p-12">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-amber-500/5 rounded-full blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="relative">
          <Logo href="/" variant="default" size="md" />
        </div>
        <div className="relative">
          <h2 className="text-3xl font-bold text-white max-w-md leading-tight">
            Build with Precision.
            <br />
            Source with Prime.
          </h2>
          <p className="mt-4 text-slate-400 max-w-md leading-relaxed">
            The procurement command center trusted by 500+ contractors across Ghana.
          </p>
        </div>
        <div className="relative text-xs text-slate-600">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo href="/" variant="dark" size="sm" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
