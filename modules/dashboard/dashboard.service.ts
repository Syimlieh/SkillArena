import { DashboardData, DashboardScrim, RegisteredMatch } from "@/types/dashboard.types";
import { Scrim } from "@/types/scrim.types";
import { Match } from "@/types/match.types";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { getNextAvailableScrim } from "@/modules/scrims/scrim.selector";
import { listScrims } from "@/modules/scrims/scrim.service";
import { listMatches } from "@/modules/matches/match.service";
import { MatchStatus } from "@/enums/MatchStatus.enum";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";
import { RegistrationModel } from "@/models/Registration.model";

const markConfirmed = (scrim: Scrim): DashboardScrim => ({
  ...scrim,
  confirmed: true,
});

const serializeScrim = (scrim: Scrim): Scrim => ({
  ...scrim,
  _id: scrim._id ? (scrim._id as any).toString() : undefined,
  startTime: scrim.startTime ? new Date(scrim.startTime) : scrim.startTime,
  createdAt: scrim.createdAt ? (new Date(scrim.createdAt) as any) : undefined,
  updatedAt: scrim.updatedAt ? (new Date(scrim.updatedAt) as any) : undefined,
});

const serializeMatch = (match: Match): Match => ({
  ...match,
  _id: match._id ? (match._id as any).toString() : undefined,
  startTime: match.startTime ? new Date(match.startTime) : match.startTime,
  createdAt: match.createdAt ? (new Date(match.createdAt) as any) : undefined,
  updatedAt: match.updatedAt ? (new Date(match.updatedAt) as any) : undefined,
});

const toRegisteredMatch = (match: Match, regStatus: RegistrationStatus): RegisteredMatch => {
  const paymentStatus =
    regStatus === RegistrationStatus.PENDING_PAYMENT ? PaymentStatus.INITIATED : PaymentStatus.SUCCESS;
  return { match, registrationStatus: regStatus, paymentStatus };
};

/* ── Individual data-fetching functions for split pages ── */

export type UserDashboardStats = {
  registeredCount: number;
  availableCount: number;
  hostedCount: number;
  historyCount: number;
};

export const getUserDashboardStats = async (userId: string): Promise<UserDashboardStats> => {
  const [upcomingMatches, ongoingMatches] = await Promise.all([
    listMatches(MatchStatus.UPCOMING),
    listMatches(MatchStatus.ONGOING),
  ]);
  const relevantMatches = [...upcomingMatches, ...ongoingMatches];
  const relevantMap = new Map(relevantMatches.map((m) => [m.matchId, m]));

  const [regs, hostedMatches, scrims] = await Promise.all([
    RegistrationModel.find({ userId }).lean(),
    listMatches(undefined, userId),
    listScrims(),
  ]);

  const registeredCount = regs.filter((r) => relevantMap.has(r.matchId)).length;
  const registeredIds = regs.map((r) => r.matchId);
  const hostedIds = hostedMatches.map((m) => m.matchId);
  const availableCount = upcomingMatches.filter(
    (m) => !registeredIds.includes(m.matchId) && !hostedIds.includes(m.matchId)
  ).length;
  const hostedCount = hostedMatches.length;
  const historyCount = scrims.filter((s) => s.status === ScrimStatus.COMPLETED).length;

  return { registeredCount, availableCount, hostedCount, historyCount };
};

export const getRegisteredMatches = async (userId: string): Promise<RegisteredMatch[]> => {
  const [upcomingMatches, ongoingMatches] = await Promise.all([
    listMatches(MatchStatus.UPCOMING),
    listMatches(MatchStatus.ONGOING),
  ]);
  const relevantMatches = [...upcomingMatches, ...ongoingMatches];
  const relevantMap = new Map(relevantMatches.map((m) => [m.matchId, m]));

  const regs = await RegistrationModel.find({ userId }).lean();
  return regs
    .map((r) => {
      const match = relevantMap.get(r.matchId);
      if (!match) return null;
      return toRegisteredMatch(serializeMatch(match), r.status ?? RegistrationStatus.NONE);
    })
    .filter(Boolean) as RegisteredMatch[];
};

export const getAvailableMatches = async (userId: string): Promise<Match[]> => {
  const upcomingMatches = (await listMatches(MatchStatus.UPCOMING)).map(serializeMatch);
  const [regs, hostedMatches] = await Promise.all([
    RegistrationModel.find({ userId }).lean(),
    listMatches(undefined, userId),
  ]);
  const registeredIds = regs.map((r) => r.matchId);
  const hostedIds = hostedMatches.map((m) => m.matchId);
  return upcomingMatches.filter(
    (m) => !registeredIds.includes(m.matchId) && !hostedIds.includes(m.matchId)
  );
};

export const getHostedMatches = async (userId: string): Promise<Match[]> => {
  return (await listMatches(undefined, userId)).map(serializeMatch);
};

export const getMatchHistory = async (): Promise<DashboardScrim[]> => {
  const scrims = (await listScrims()).map(serializeScrim);
  return scrims
    .filter((scrim) => scrim.status === ScrimStatus.COMPLETED)
    .map((scrim, idx) => ({ ...scrim, confirmed: true, placement: idx + 1, prizeWon: 0 }));
};

/* ── Legacy: full dashboard data (kept for reference) ── */

export const getDashboardData = async (userId?: string): Promise<DashboardData> => {
  const scrims = (await listScrims()).map(serializeScrim);
  const upcomingMatches: Match[] = (await listMatches(MatchStatus.UPCOMING)).map(serializeMatch);
  const ongoingMatches: Match[] = (await listMatches(MatchStatus.ONGOING)).map(serializeMatch);
  const relevantMatches = [...upcomingMatches, ...ongoingMatches];
  const relevantMap = new Map(relevantMatches.map((m) => [m.matchId, m]));

  let registeredMatches: RegisteredMatch[] = [];
  let hostedMatches: Match[] = [];
  if (userId) {
    const regs = await RegistrationModel.find({ userId }).lean();
    const matchIds = regs.map((r) => r.matchId);
    registeredMatches = matchIds
      .map((id) => {
        const match = relevantMap.get(id);
        if (!match) return null;
        const reg = regs.find((r) => r.matchId === id);
        return toRegisteredMatch(match, reg?.status ?? RegistrationStatus.NONE);
      })
      .filter(Boolean) as RegisteredMatch[];
    hostedMatches = (await listMatches(undefined, userId)).map(serializeMatch);
  }

  const registeredIds = registeredMatches.map((r) => r.match.matchId);
  const hostedIds = hostedMatches.map((m) => m.matchId);
  const availableMatches = upcomingMatches.filter(
    (m) => !registeredIds.includes(m.matchId) && !hostedIds.includes(m.matchId)
  );

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
    hostedMatches,
    registeredMatches,
  };
};
