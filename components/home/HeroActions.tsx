"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Scrim } from "@/types/scrim.types";
import { AuthStatus } from "@/enums/AuthStatus.enum";
import { useAuth } from "@/context/AuthContext";
import { AppRoute, buildScrimDetailRoute } from "@/lib/routes";
import { rememberPostLoginRedirect } from "@/lib/auth";
import { handleAuthRedirect, NavigationService } from "@/modules/navigation/navigation.service";
import { getNextAvailableScrim, resolveScrimSlug } from "@/modules/scrims/scrim.selector";

interface Props {
  scrims: Scrim[];
}

const resolveTargetPath = (scrim: Scrim | undefined): string | null => {
  if (!scrim) return null;
  const slug = resolveScrimSlug(scrim);
  return slug ? buildScrimDetailRoute(slug) : null;
};

export const HeroActions = ({ scrims }: Props) => {
  const router = useRouter();
  const { state } = useAuth();
  const isAuthenticated = state.status === AuthStatus.AUTHENTICATED && !!state.user;
  const [feedback, setFeedback] = useState<string | undefined>();

  const nextScrim = useMemo(() => getNextAvailableScrim(scrims), [scrims]);
  const nextScrimPath = useMemo(() => resolveTargetPath(nextScrim), [nextScrim]);
  const joinDisabled = !nextScrimPath;

  const handleLogin = useCallback(() => {
    NavigationService.toLoginWithRedirect(router, AppRoute.HOME);
  }, [router]);

  const handleViewSchedule = useCallback(() => {
    NavigationService.toSchedule(router);
  }, [router]);

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
      <Button variant="secondary" onClick={handleViewSchedule}>
        View Schedule
      </Button>
      {feedback && <p className="text-sm text-red-400">{feedback}</p>}
    </div>
  );
};
