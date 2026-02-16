"use client";

import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

type LogoProps = {
  href?: string;
  /** "default" (light text on dark works well), "dark" for dark logo on light bg */
  variant?: "default" | "dark";
  /** Compact: icon + short text; full: icon + full branding */
  size?: "sm" | "md" | "lg";
  className?: string;
  showLabel?: boolean;
};

const sizes = {
  sm: { icon: 32, label: "text-xs" },
  md: { icon: 40, label: "text-sm" },
  lg: { icon: 48, label: "text-base" },
};

export function Logo({
  href = "/",
  variant = "default",
  size = "md",
  className = "",
  showLabel = true,
}: LogoProps) {
  const { icon: iconSize, label: labelSize } = sizes[size];
  const content = (
    <>
      <span className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-transparent">
        <Image
          src="/logo.png"
          alt={APP_NAME}
          width={iconSize}
          height={iconSize}
          className="object-contain"
          style={{ width: iconSize, height: iconSize }}
          priority
          unoptimized={false}
        />
      </span>
      {showLabel && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-tight leading-none ${labelSize} ${
              variant === "dark" ? "text-slate-950" : "text-white"
            }`}
          >
            {APP_NAME}
          </span>
          <span
            className={`text-[10px] font-medium tracking-widest uppercase leading-none mt-0.5 ${
              variant === "dark" ? "text-slate-400" : "text-slate-400"
            }`}
          >
            Ghana
          </span>
        </div>
      )}
    </>
  );

  const wrapperClass = `flex items-center gap-2.5 group transition-transform hover:opacity-90 ${className}`;

  if (href) {
    return (
      <Link href={href} className={wrapperClass}>
        {content}
      </Link>
    );
  }
  return <div className={wrapperClass}>{content}</div>;
}
