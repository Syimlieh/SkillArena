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
  const base = "glow-hover rounded-xl font-semibold transition-all";
  const sizes: Record<ButtonSize, string> = {
    md: "px-4 py-2 text-sm uppercase tracking-wide",
    sm: "px-3 py-1.5 text-xs uppercase tracking-wide",
  };
  const styles: Record<ButtonVariant, string> = {
    primary:
      "border border-[var(--panel-border)] bg-[linear-gradient(115deg,var(--accent-primary),var(--accent-secondary))] text-[#03121f] shadow-[0_0_28px_rgba(49,255,225,0.34)] hover:brightness-110",
    secondary:
      "border border-[var(--panel-border)] bg-[var(--bg-secondary)]/70 text-[var(--text-primary)] shadow-[0_0_20px_rgba(49,255,225,0.12)] hover:border-[var(--accent-primary)]",
    ghost:
      "text-[var(--ghost-text)] border border-[var(--ghost-border)] bg-[var(--card-bg)]/35 hover:border-[var(--accent-primary)]",
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
