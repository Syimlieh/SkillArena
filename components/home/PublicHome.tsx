import HeroSection from "@/components/home/HeroSection";
import UpcomingMatchesSection from "@/components/home/UpcomingMatchesSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import { listMatches } from "@/modules/matches/match.service";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { Match } from "@/types/match.types";
import { HomeMatch } from "@/lib/home.content";

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

const PublicHome = async () => {
  const matches = await listMatches(MatchStatus.UPCOMING);
  const topMatches = matches.slice(0, 6).map(toHomeMatch);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <HeroSection />
      <UpcomingMatchesSection matches={topMatches} />
      <FeaturesSection />
    </div>
  );
};

export default PublicHome;
