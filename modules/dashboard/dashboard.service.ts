import { DashboardData, DashboardScrim } from "@/types/dashboard.types";
import { Scrim } from "@/types/scrim.types";
import { Match } from "@/types/match.types";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { getNextAvailableScrim } from "@/modules/scrims/scrim.selector";
import { listScrims } from "@/modules/scrims/scrim.service";
import { listMatches } from "@/modules/matches/match.service";
import { MatchStatus } from "@/enums/MatchStatus.enum";

const markConfirmed = (scrim: Scrim): DashboardScrim => ({
  ...scrim,
  confirmed: true,
});

const serializeScrim = (scrim: Scrim): Scrim => ({
  ...scrim,
  _id: scrim._id ? (scrim._id as any).toString() : undefined,
  startTime: scrim.startTime ? new Date(scrim.startTime).toISOString() : scrim.startTime,
  createdAt: scrim.createdAt ? new Date(scrim.createdAt).toISOString() as any : undefined,
  updatedAt: scrim.updatedAt ? new Date(scrim.updatedAt).toISOString() as any : undefined,
});

const serializeMatch = (match: Match): Match => ({
  ...match,
  _id: match._id ? (match._id as any).toString() : undefined,
  startTime: match.startTime ? new Date(match.startTime).toISOString() : match.startTime,
  createdAt: match.createdAt ? new Date(match.createdAt).toISOString() as any : undefined,
  updatedAt: match.updatedAt ? new Date(match.updatedAt).toISOString() as any : undefined,
});

export const getDashboardData = async (): Promise<DashboardData> => {
  const scrims = (await listScrims()).map(serializeScrim);
  const availableMatches: Match[] = (await listMatches(MatchStatus.UPCOMING)).map(serializeMatch);

  // Placeholder: assumes all UPCOMING/COMPLETED scrims in DB are joined by the user.
  const upcoming = scrims
    .filter((scrim) => scrim.status === ScrimStatus.UPCOMING)
    .map(markConfirmed);
  const history = scrims
    .filter((scrim) => scrim.status === ScrimStatus.COMPLETED)
    .map((scrim, idx) => ({ ...scrim, confirmed: true, placement: idx + 1, prizeWon: 0 }));

  const nextJoinable = getNextAvailableScrim(scrims);

  return {
    upcoming,
    history,
    nextJoinable,
    availableMatches,
  };
};
