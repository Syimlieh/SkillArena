import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  tone?: "success" | "warning" | "neutral";
}

export const Badge = ({ children, tone = "neutral" }: Props) => {
  const styles: Record<typeof tone, string> = {
    success: "bg-[rgba(66,255,135,0.15)] text-[var(--primary)] border border-[rgba(66,255,135,0.4)]",
    warning: "bg-[rgba(255,140,0,0.12)] text-orange-300 border border-[rgba(255,140,0,0.4)]",
    neutral: "bg-[#111827] text-slate-200 border border-[#1f2937]",
  };

  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold uppercase", styles[tone])}>
      {children}
    </span>
  );
};
