"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardData } from "@/types/dashboard.types";
import { AuthStatus } from "@/enums/AuthStatus.enum";
import { Button } from "@/components/ui/Button";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import { UpcomingMatches } from "@/components/dashboard/UpcomingMatches";
import { MatchHistory } from "@/components/dashboard/MatchHistory";
import { useAuth } from "@/context/AuthContext";
import { rememberPostLoginRedirect } from "@/lib/auth";
import { AppRoute, buildScrimDetailRoute } from "@/lib/routes";
import { handleAuthRedirect } from "@/modules/navigation/navigation.service";
import { resolveScrimSlug } from "@/modules/scrims/scrim.selector";

interface Props {
  data: DashboardData;
}

const DashboardClient = ({ data }: Props) => {
  const router = useRouter();
  const { state } = useAuth();
  const isAuthenticated = state.status === AuthStatus.AUTHENTICATED && !!state.user;
  const [feedback, setFeedback] = useState<string | undefined>();

  const hasUpcoming = data.upcoming.length > 0;
  const nextJoinablePath = useMemo(() => {
    if (!data.nextJoinable) return null;
    const slug = resolveScrimSlug(data.nextJoinable);
    return slug ? buildScrimDetailRoute(slug) : null;
  }, [data.nextJoinable]);

  const joinDisabledMessage = useMemo(() => {
    if (hasUpcoming) return "You already have an upcoming match";
    if (!nextJoinablePath) return "No upcoming matches available";
    return undefined;
  }, [hasUpcoming, nextJoinablePath]);

  const handleJoinNext = useCallback(() => {
    if (joinDisabledMessage || !nextJoinablePath) {
      setFeedback(joinDisabledMessage);
      return;
    }
    setFeedback(undefined);
    if (!isAuthenticated) rememberPostLoginRedirect(nextJoinablePath);
    handleAuthRedirect(router, isAuthenticated, nextJoinablePath);
  }, [isAuthenticated, joinDisabledMessage, nextJoinablePath, router]);

  const renderBody = () => {
    if (data.upcoming.length === 0 && data.history.length === 0) {
      return (
        <DashboardEmptyState
          onJoin={handleJoinNext}
          disabled={!!joinDisabledMessage}
          feedback={joinDisabledMessage}
        />
      );
    }

    return (
      <div className="space-y-8">
        {data.upcoming.length > 0 && <UpcomingMatches scrims={data.upcoming} />}
        {data.history.length > 0 && <MatchHistory scrims={data.history} />}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Player Dashboard</h1>
          <p className="text-sm text-slate-400">Track scrims, payouts, and performance.</p>
        </div>
        <Button onClick={handleJoinNext} disabled={!!joinDisabledMessage}>
          {joinDisabledMessage ? joinDisabledMessage : "Join New Match"}
        </Button>
      </div>
      {renderBody()}
      {feedback && <p className="text-sm text-red-400">{feedback}</p>}
    </div>
  );
};

export default DashboardClient;
