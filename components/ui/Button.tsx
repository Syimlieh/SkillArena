"use client"

import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export const Button = ({ variant = "primary", className, icon, children, ...props }: Props) => {
  const base = "rounded-xl px-4 py-2 font-semibold transition-colors glow-hover";
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-[var(--primary)] text-black hover:bg-[#63ff9b]",
    secondary: "bg-[#111827] text-white border border-[#1f2937] hover:border-[var(--primary)]",
    ghost: "text-white border border-transparent hover:border-[var(--primary)]",
  };

  return (
    <button className={clsx(base, styles[variant], className)} {...props}>
      <span className="flex items-center gap-2 text-sm uppercase tracking-wide">
        {icon}
        {children}
      </span>
    </button>
  );
};
