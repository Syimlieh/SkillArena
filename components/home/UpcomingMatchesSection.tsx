import { HomeMatch } from "@/lib/home.content";
import MatchCard from "@/components/home/MatchCard";

interface Props {
  matches: HomeMatch[];
}

export const UpcomingMatchesSection = ({ matches }: Props) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-[var(--text-primary)]">Upcoming Matches</h2>
    </div>
    {matches.length === 0 ? (
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-6 text-[var(--text-secondary)]">
        No upcoming matches are available right now. Check back soon.
      </div>
    ) : (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    )}
  </section>
);

export default UpcomingMatchesSection;
