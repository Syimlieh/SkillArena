import { MatchStatus } from "@/enums/MatchStatus.enum";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { connectDb } from "@/lib/db";
import { MatchModel } from "@/models/Match.model";
import { RegistrationModel } from "@/models/Registration.model";
import { Registration } from "@/types/registration.types";
import { AuthContext } from "@/lib/auth.server";
import { Match } from "@/types/match.types";

export const ACTIVE_REG_STATUSES = [RegistrationStatus.PENDING_PAYMENT, RegistrationStatus.CONFIRMED];

export class RegistrationError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const findMatchById = async (matchId: string): Promise<Match | null> => {
  return MatchModel.findOne({ matchId }).lean<Match>();
};

const ensureMatchIsJoinable = (match: Match) => {
  if (match.status !== MatchStatus.UPCOMING) {
    throw new RegistrationError("Match is not open for registration", 409);
  }
};

const ensureSlotsAvailable = async (matchId: string, maxSlots: number) => {
  const activeCount = await RegistrationModel.countDocuments({
    matchId,
    status: { $in: ACTIVE_REG_STATUSES },
  });
  if (activeCount >= maxSlots) {
    throw new RegistrationError("No slots available for this match", 409);
  }
};

const ensureNotAlreadyRegistered = async (userId: string, matchId: string) => {
  const existing = await RegistrationModel.findOne({
    userId,
    matchId,
    status: { $ne: RegistrationStatus.CANCELLED },
  }).lean();
  if (existing) {
    throw new RegistrationError("You are already registered for this match", 409);
  }
};

export const registerForMatch = async (matchId: string, userId: string, teamName?: string) => {
  await connectDb();

  const match = await findMatchById(matchId);
  if (!match) {
    throw new RegistrationError("Match not found", 404);
  }

  ensureMatchIsJoinable(match);
  await ensureSlotsAvailable(match.matchId, match.maxSlots);
  await ensureNotAlreadyRegistered(userId, match.matchId);

  const registration = await RegistrationModel.create({
    userId,
    matchId: match.matchId,
    teamName,
    status: RegistrationStatus.PENDING_PAYMENT,
  });

  return {
    registration: registration.toObject(),
    match,
  };
};

export const registerForMatchAsAdmin = async (
  matchId: string,
  userId: string,
  actor: AuthContext,
  payload?: { reference?: string; amount?: number; method?: string; note?: string; teamName?: string }
) => {
  await connectDb();

  const match = await findMatchById(matchId);
  if (!match) {
    throw new RegistrationError("Match not found", 404);
  }

  ensureMatchIsJoinable(match);
  await ensureSlotsAvailable(match.matchId, match.maxSlots);
  await ensureNotAlreadyRegistered(userId, match.matchId);

  const registration = await RegistrationModel.create({
    userId,
    matchId: match.matchId,
    teamName: payload?.teamName,
    status: payload?.amount || payload?.reference ? RegistrationStatus.CONFIRMED : RegistrationStatus.PENDING_PAYMENT,
    paymentReference: payload?.reference,
    paymentAmount: payload?.amount,
    paymentMethod: payload?.method,
    paymentNote: payload?.note,
    recordedBy: actor.userId,
  });

  return {
    registration: registration.toObject(),
    match,
  };
};
