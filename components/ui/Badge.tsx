import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  tone?: "success" | "warning" | "neutral";
  className?: string;
}

export const Badge = ({ children, tone = "neutral", className }: Props) => {
  const styles: Record<typeof tone, string> = {
    success: "bg-[rgba(49,255,225,0.16)] text-[var(--primary)] border border-[rgba(49,255,225,0.45)] shadow-[0_0_18px_rgba(49,255,225,0.2)]",
    warning: "bg-[var(--warning-bg)] text-[var(--warning-text)] border border-[var(--warning-border)]",
    neutral: "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--panel-border)]",
  };

  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold uppercase", styles[tone], className)}>
      {children}
    </span>
  );
};
