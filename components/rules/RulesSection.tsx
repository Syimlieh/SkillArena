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
    <div className={clsx("rounded-2xl border border-[#1f2937] bg-[#0b1020]/70 p-5 shadow-lg shadow-black/30", highlight && "border-[rgba(66,255,135,0.4)]")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {highlight && <Badge tone="success" className="text-[10px] uppercase">Important</Badge>}
      </div>
      <div className="space-y-2 text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  </section>
);

export default RulesSection;
