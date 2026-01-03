import { ReactNode } from "react";
import clsx from "clsx";
import { Badge } from "@/components/ui/Badge";

interface Props {
  id: string;
  title: string;
  children: ReactNode;
  highlight?: boolean;
}

export const RulesSection = ({ id, title, children, highlight }: Props) => (
  <section id={id} className="scroll-mt-24">
    <div
      className={clsx(
        "glass-panel rounded-2xl p-5",
        highlight && "border-[var(--primary)] border"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">{title}</h2>
        {highlight && <Badge tone="success" className="text-[10px] uppercase">Important</Badge>}
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-[var(--text-secondary)]">{children}</div>
    </div>
  </section>
);

export default RulesSection;
