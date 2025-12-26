"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Scrim } from "@/types/scrim.types";
import { Match } from "@/types/match.types";
import { AuthStatus } from "@/enums/AuthStatus.enum";
import { useAuth } from "@/context/AuthContext";
import { AppRoute, buildScrimDetailRoute } from "@/lib/routes";
import { rememberPostLoginRedirect } from "@/lib/auth";
import { handleAuthRedirect, NavigationService } from "@/modules/navigation/navigation.service";
import { getNextAvailableScrim, resolveScrimSlug } from "@/modules/scrims/scrim.selector";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";

interface Props {
  scrims?: Scrim[];
  matches?: Match[];
}

const resolveTargetPath = (scrim: Scrim | undefined): string | null => {
  if (!scrim) return null;
  const slug = resolveScrimSlug(scrim);
  return slug ? buildScrimDetailRoute(slug) : null;
};

const mapMatchesToScrims = (matches?: Match[]): Scrim[] => {
  if (!matches?.length) return [];
  return matches.map((m) => ({
    _id: m._id as any,
    slug: m.slug ?? m.matchId,
    title: m.title,
    status: ScrimStatus.UPCOMING,
    startTime: m.startTime as any,
    maxSlots: m.maxSlots,
    availableSlots: m.maxSlots,
    prizePool: m.prizePool,
    entryFee: m.entryFee,
    map: m.map as any,
  }));
};

export const HeroActions = ({ scrims, matches }: Props) => {
  const router = useRouter();
  const { state } = useAuth();
  const isAuthenticated = state.status === AuthStatus.AUTHENTICATED && !!state.user;
  const [feedback, setFeedback] = useState<string | undefined>();

  const pool = useMemo(() => scrims ?? mapMatchesToScrims(matches), [scrims, matches]);
  const nextScrim = useMemo(() => getNextAvailableScrim(pool), [pool]);
  const nextScrimPath = useMemo(() => resolveTargetPath(nextScrim), [nextScrim]);
  const joinDisabled = !nextScrimPath;

  const handleJoinNext = useCallback(() => {
    if (!nextScrimPath) {
      setFeedback("No eligible matches are available right now.");
      return;
    }
    setFeedback(undefined);
    if (!isAuthenticated) rememberPostLoginRedirect(nextScrimPath);
    handleAuthRedirect(router, isAuthenticated, nextScrimPath);
  }, [isAuthenticated, nextScrimPath, router]);

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleJoinNext} disabled={joinDisabled}>
        {joinDisabled ? "No Slots Available" : "Join Next Match"}
      </Button>
      {feedback && <p className="text-sm text-red-400">{feedback}</p>}
    </div>
  );
};
