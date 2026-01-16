import HeroSection from "@/components/home/HeroSection";
import UpcomingMatchesSection from "@/components/home/UpcomingMatchesSection";
import RecentResultsSection from "@/components/home/RecentResultsSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import { listMatches, listRecentMatchResults } from "@/modules/matches/match.service";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { Match } from "@/types/match.types";
import { HomeMatch, HomeResult } from "@/lib/home.content";

const formatTime = (date: Date | string) =>
  new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date(date));

const toHomeMatch = (match: Match): HomeMatch => ({
  id: match._id?.toString() ?? match.matchId,
  title: match.title ?? match.matchId,
  map: match.map,
  startTime: formatTime(match.startTime),
  entryFee: `₹${match.entryFee}`,
  prizePool: `₹${match.prizePool}`,
  status: match.status ?? MatchStatus.UPCOMING,
  matchId: match.slug ?? match.matchId?.toLowerCase(),
});

const formatHistoryTime = (date: Date | string) => {
  const formatter = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });
  const parts = formatter.formatToParts(new Date(date));
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((part) => part.type === "dayPeriod")?.value ?? "";
  return `${day} ${month} • ${hour}:${minute} ${dayPeriod}`;
};

const toHomeResult = (result: Awaited<ReturnType<typeof listRecentMatchResults>>[number]): HomeResult => ({
  id: result.slug ?? result.matchId,
  title: result.title,
  map: result.map,
  dateLabel: formatHistoryTime(result.startTime),
  prizePool: `₹${result.prizePool}`,
  status: MatchStatus.COMPLETED,
  matchId: result.slug ?? result.matchId?.toLowerCase(),
  winnerTeam: result.winnerTeam ?? "Winner",
  winnerAvatarUrl: result.winnerAvatarUrl,
  winnerKills: result.winnerKills,
  winnerPosition: result.winnerPosition,
  winnerTotalScore: result.winnerTotalScore,
});

const PublicHome = async () => {
  const matches = await listMatches(MatchStatus.UPCOMING);
  const topMatches = matches.slice(0, 6).map(toHomeMatch);
  const results = await listRecentMatchResults(6);
  const recentResults = results.map(toHomeResult);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <HeroSection />
      <RecentResultsSection results={recentResults} />
      <UpcomingMatchesSection matches={topMatches} />
      <FeaturesSection />
    </div>
  );
};

export default PublicHome;
