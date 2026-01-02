import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MatchMap } from "@/enums/MatchMap.enum";

const mockHistory = [
  { matchId: "ER-20241220-001", map: MatchMap.ERANGEL, datetime: "2024-12-20T14:00:00Z", placement: 1, kills: 6, prize: 1370, result: "WINNER" },
  { matchId: "LV-20241218-002", map: MatchMap.LIVIK, datetime: "2024-12-18T16:00:00Z", placement: 2, kills: 4, prize: 150, result: "RUNNER UP" },
  { matchId: "ER-20241215-003", map: MatchMap.ERANGEL, datetime: "2024-12-15T18:00:00Z", placement: 5, kills: 2, prize: 0, result: "ELIMINATED" },
];

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

const resultTone = (result: string) => {
  if (result === "WINNER") return "success" as const;
  if (result === "RUNNER UP") return "warning" as const;
  return "neutral" as const;
};

export const PreviousMatchesTable = () => (
  <div className="glass-panel rounded-2xl p-4">
    <div className="mb-3 text-sm uppercase text-[var(--primary)]">Previous Matches</div>
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="text-xs uppercase text-slate-400">
          <tr>
            <th className="pb-2 pr-4">Match ID</th>
            <th className="pb-2 pr-4">Map</th>
            <th className="pb-2 pr-4">Date / Time</th>
            <th className="pb-2 pr-4">Placement</th>
            <th className="pb-2 pr-4">Kills</th>
            <th className="pb-2 pr-4">Prize Won</th>
            <th className="pb-2 pr-4">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#0f172a]">
          {mockHistory.map((row) => {
            const href = `/matches/${row.matchId.toLowerCase()}`;
            return (
              <tr key={row.matchId} className="transition hover:bg-[#0b1224]/60">
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]">
                    {row.matchId}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    {row.map}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    {formatTime(row.datetime)}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    {row.placement}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    {row.kills}
                  </Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">₹{row.prize}</Link>
                </td>
                <td className="p-0">
                  <Link href={href} className="block py-2 pr-4">
                    <Badge tone={resultTone(row.result)}>{row.result}</Badge>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);
