import clsx from "clsx";
import { RulesTableRow } from "@/lib/rules.constants";

interface Props {
  title: string;
  rows: RulesTableRow[];
}

export const RulesTable = ({ title, rows }: Props) => (
  <div className="rounded-2xl border border-[#1f2937] bg-[#0c111a] p-4 shadow-inner shadow-black/20">
    <div className="mb-3 text-xs uppercase tracking-wide text-slate-400">{title}</div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead>
          <tr className="text-xs uppercase text-slate-400">
            <th className="pb-2 pr-4">Violation</th>
            <th className="pb-2 pr-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#111827]">
          {rows.map((row) => (
            <tr key={row.label} className="hover:bg-[#0f172a]/50">
              <td className="py-2 pr-4 font-semibold">{row.label}</td>
              <td className="py-2 pr-4 text-slate-300">{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RulesTable;
