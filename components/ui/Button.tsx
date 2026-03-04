"use client"

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Spinner } from "@/components/ui/Loader";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "md" | "sm";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
}

export const Button = ({ variant = "primary", size = "md", className, icon, loading = false, children, disabled, ...props }: Props) => {
  const base = "glow-hover rounded-xl font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none";
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

  const resolvedDisabled = disabled || loading;
  const resolvedIcon = loading ? <Spinner size="sm" label="Loading" /> : icon;

  return (
    <button className={clsx(base, sizes[size], styles[variant], className)} disabled={resolvedDisabled} aria-busy={loading || undefined} {...props}>
      <span className="flex items-center gap-2">
        {resolvedIcon}
        {children}
      </span>
    </button>
  );
};
