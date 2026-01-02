export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getMatchBySlug } from "@/modules/matches/match.service";
import { Badge } from "@/components/ui/Badge";
import { MatchMap } from "@/enums/MatchMap.enum";
import RegisterButton from "@/components/matches/RegisterButton";
import AdminManualRegisterButton from "@/components/admin/AdminManualRegisterButton";

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

const MatchDetailsPage = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  if (!slug) return notFound();

  const match = await getMatchBySlug(slug);
  if (!match) return notFound();

  const prize = match.prizeBreakdown;
  const clientMatch = {
    ...match,
    _id: match._id ? (match._id as any).toString() : undefined,
    startTime: match.startTime ? new Date(match.startTime).toISOString() : match.startTime,
  };

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">{match.title}</h1>
          <p className="text-sm text-slate-400">Match ID: {match.matchId}</p>
        </div>
        <Badge tone={match.map === MatchMap.LIVIK ? "warning" : "success"}>Map: {match.map}</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="glass-panel rounded-xl p-4">
          <div className="text-xs uppercase text-[var(--primary)]">Start Time</div>
          <div className="text-lg font-semibold">{formatTime(match.startTime)}</div>
        </div>
        <div className="glass-panel rounded-xl p-4">
          <div className="text-xs uppercase text-[var(--primary)]">Entry Fee</div>
          <div className="text-lg font-semibold">₹{match.entryFee}</div>
        </div>
      </div>
      <div className="glass-panel rounded-xl p-4">
        <div className="text-xs uppercase text-[var(--primary)]">Prize Breakdown</div>
        <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="font-semibold text-white">1st</div>
            <div className="text-slate-300">₹{prize.first}</div>
          </div>
          <div>
            <div className="font-semibold text-white">2nd</div>
            <div className="text-slate-300">₹{prize.second}</div>
          </div>
          <div>
            <div className="font-semibold text-white">3rd</div>
            <div className="text-slate-300">₹{prize.third}</div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <RegisterButton match={clientMatch} />
        <div className="flex justify-center">
          <div className="w-full max-w-xl">
            <AdminManualRegisterButton matchId={match.matchId} buttonVariant="primary" fullWidth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsPage;
