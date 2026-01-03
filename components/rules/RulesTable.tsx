import clsx from "clsx";
import { RulesTableRow } from "@/lib/rules.constants";

interface Props {
  title: string;
  rows: RulesTableRow[];
}

export const RulesTable = ({ title, rows }: Props) => (
  <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-inner shadow-black/10">
    <div className="mb-3 text-xs uppercase tracking-wide text-[var(--text-secondary)]">{title}</div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-[var(--text-primary)]">
        <thead>
          <tr className="text-xs uppercase text-[var(--text-secondary)]">
            <th className="pb-2 pr-4">Violation</th>
            <th className="pb-2 pr-4">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {rows.map((row) => (
            <tr key={row.label} className="hover:bg-[var(--bg-secondary)]/60 transition">
              <td className="py-2 pr-4 font-semibold">{row.label}</td>
              <td className="py-2 pr-4 text-[var(--text-secondary)]">{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RulesTable;
