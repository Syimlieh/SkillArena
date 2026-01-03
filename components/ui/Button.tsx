"use client"

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
}

export const Button = ({ variant = "primary", size = "md", className, icon, children, ...props }: Props) => {
  const base = "rounded-xl font-semibold transition-colors glow-hover";
  const sizes: Record<ButtonSize, string> = {
    md: "px-4 py-2 text-sm uppercase tracking-wide",
    sm: "px-3 py-1.5 text-xs uppercase tracking-wide",
  };
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-[var(--primary)] text-black hover:bg-[#63ff9b]",
    secondary: "bg-[#111827] text-white border border-[#1f2937] hover:border-[var(--primary)]",
    ghost: "text-[var(--ghost-text)] border border-[var(--ghost-border)] hover:border-[var(--primary)]",
  };

  return (
    <button className={clsx(base, sizes[size], styles[variant], className)} {...props}>
      <span className="flex items-center gap-2">
        {icon}
        {children}
      </span>
    </button>
  );
};
