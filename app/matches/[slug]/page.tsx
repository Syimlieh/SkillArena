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
  console.log("Slug:", slug);
  if (!slug) return notFound();

  const match = await getMatchBySlug(slug);
  console.log("Match:", match);
  if (!match) return notFound();

  const prize = match.prizeBreakdown;
  console.log("Prize Breakdown:", prize);
  const clientMatch = {
    ...match,
    _id: match._id ? (match._id as any).toString() : undefined,
    startTime: match.startTime ? new Date(match.startTime).toISOString() : match.startTime,
  };
  console.log("Client Match:", clientMatch);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6 text-[var(--text-primary)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">{match.title}</h1>
          <p className="text-sm text-[var(--text-secondary)]">Match ID: {match.matchId}</p>
        </div>
        <div className="flex-shrink-0">
          <Badge
            tone={match.map === MatchMap.LIVIK ? "warning" : "success"}
            className="whitespace-nowrap px-4 text-[11px]"
          >
            Map: {match.map}
          </Badge>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-sm">
          <div className="text-xs uppercase text-[var(--text-secondary)]">Start Time</div>
          <div className="text-lg font-semibold">{formatTime(match.startTime)}</div>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-sm">
          <div className="text-xs uppercase text-[var(--text-secondary)]">Entry Fee</div>
          <div className="text-lg font-semibold">₹{match.entryFee}</div>
        </div>
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-sm">
          <div className="text-xs uppercase text-[var(--text-secondary)]">Registered Users</div>
          <div className="text-lg font-semibold">{`${match.registrationCount ?? 0}/${match.maxSlots}`}</div>
        </div>
      </div>
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4 shadow-sm">
        <div className="text-xs uppercase text-[var(--text-secondary)]">Prize Breakdown</div>
        <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
          <div>
            <div className="font-semibold text-[var(--text-primary)]">1st</div>
            <div className="text-[var(--text-secondary)]">₹{prize.first}</div>
          </div>
          <div>
            <div className="font-semibold text-[var(--text-primary)]">2nd</div>
            <div className="text-[var(--text-secondary)]">₹{prize.second}</div>
          </div>
          <div>
            <div className="font-semibold text-[var(--text-primary)]">3rd</div>
            <div className="text-[var(--text-secondary)]">₹{prize.third}</div>
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
