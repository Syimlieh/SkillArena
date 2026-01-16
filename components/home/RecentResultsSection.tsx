"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { HomeResult } from "@/lib/home.content";

interface Props {
  results: HomeResult[];
}

const buildInitials = (team: string) => team.slice(0, 2).toUpperCase();

export const RecentResultsSection = ({ results }: Props) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const total = results.length;

  useEffect(() => {
    const track = trackRef.current;
    const first = track?.querySelector<HTMLElement>("[data-result-card]");
    setCardWidth(first ? first.offsetWidth + 16 : 0);
  }, [results.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const handleScroll = () => {
      if (!cardWidth) return;
      const nextIndex = Math.round(track.scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(nextIndex, 0), Math.max(total - 1, 0)));
    };
    handleScroll();
    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, [cardWidth, total]);

  const scrollByCards = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track || !cardWidth) return;
    const nextLeft = direction === "next" ? track.scrollLeft + cardWidth : track.scrollLeft - cardWidth;
    track.scrollTo({ left: nextLeft, behavior: "smooth" });
  };

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Recent Match Results</h2>
        <p className="text-sm text-[var(--text-secondary)]">Latest completed matches and their champions.</p>
      </div>
      {results.length === 0 ? (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-4 py-6 text-[var(--text-secondary)]">
          No recent results are available yet.
        </div>
      ) : (
        <div className="relative">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-2 scrollbar-none"
          >
            {results.map((result) => (
              <div
                key={result.id}
                data-result-card
                className="relative w-[280px] flex-none snap-start overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)]/70 p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg md:w-[320px]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(66,255,135,0.16),_transparent_55%)]" />
                <div className="relative flex items-center justify-between text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--accent-primary)]">{result.map} Scrim</span>
                  <Badge tone="success" className="text-[10px]">
                    Completed
                  </Badge>
                </div>
                <div className="relative mt-2 text-sm text-[var(--text-secondary)]">{result.dateLabel}</div>
                <div className="relative mt-4 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/40 bg-[var(--bg-secondary)]/70">
                    {result.winnerAvatarUrl ? (
                      <img
                        src={result.winnerAvatarUrl}
                        alt={`${result.winnerTeam} avatar`}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-[var(--accent-primary)]">
                        {buildInitials(result.winnerTeam)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{result.winnerTeam}</div>
                  <span className="mt-2 inline-flex items-center gap-2 rounded-full border border-amber-400/50 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    <span className="rounded-full bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold text-amber-100">
                      1st
                    </span>
                    Winner
                  </span>
                </div>
                <div className="relative mt-4 grid gap-20 text-xs text-[var(--text-secondary)] sm:grid-cols-2">
                  <span>Map: {result.map}</span>
                  {typeof result.winnerPosition === "number" ? <span>Pos: {result.winnerPosition}</span> : null}
                  {typeof result.winnerTotalScore === "number" ? <span>Total Points: {result.winnerTotalScore}</span> : null}
                </div>
                <div className="relative mt-4 flex items-center justify-between">
                  <div className="text-lg font-semibold text-[var(--accent-primary)]">{result.prizePool}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollByCards("prev")}
            className="absolute left-0 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 px-3 py-2 text-sm text-[var(--text-primary)] backdrop-blur transition hover:border-[var(--accent-primary)] md:inline-flex"
            aria-label="Previous results"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scrollByCards("next")}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/80 px-3 py-2 text-sm text-[var(--text-primary)] backdrop-blur transition hover:border-[var(--accent-primary)] md:inline-flex"
            aria-label="Next results"
          >
            ›
          </button>
          <div className="mt-3 flex items-center justify-center gap-2">
            {results.map((_, index) => (
              <span
                key={`dot-${index}`}
                className={
                  index === activeIndex
                    ? "h-2 w-2 rounded-full bg-[var(--accent-primary)]"
                    : "h-2 w-2 rounded-full bg-[var(--border-subtle)]"
                }
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RecentResultsSection;
