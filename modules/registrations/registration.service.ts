import { MatchStatus } from "@/enums/MatchStatus.enum";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { connectDb } from "@/lib/db";
import { MatchModel } from "@/models/Match.model";
import { RegistrationModel } from "@/models/Registration.model";
import { UserModel } from "@/models/User.model";
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

const ensureRegistrationEditable = (match: Match, registration: Registration) => {
  if (match.status !== MatchStatus.UPCOMING) {
    throw new RegistrationError("Registration is locked for this match", 409);
  }
  if (registration.lockedAt) {
    throw new RegistrationError("Registration updates are locked for this match", 409);
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

const findExistingRegistration = async (userId: string, matchId: string) =>
  RegistrationModel.findOne({
    userId,
    matchId,
    status: { $ne: RegistrationStatus.CANCELLED },
  }).lean();

const ensureEmailVerified = async (userId: string) => {
  const user = await UserModel.findById(userId).lean();
  if (!user?.emailVerified) {
    throw new RegistrationError("Please verify your email before joining a match", 403);
  }
};

const ensureNotMatchOwner = (match: Match, userId: string) => {
  if (match.createdBy === userId) {
    throw new RegistrationError("Hosts cannot register for their own match", 403);
  }
};

export const registerForMatch = async (
  matchId: string,
  userId: string,
  payload: {
    teamName?: string;
    captainBgmiId: string;
    captainIgn?: string;
    squadBgmiIds?: string[];
  }
) => {
  await connectDb();

  const match = await findMatchById(matchId);
  if (!match) {
    throw new RegistrationError("Match not found", 404);
  }

  ensureMatchIsJoinable(match);
  ensureNotMatchOwner(match, userId);
  await ensureEmailVerified(userId);

  const existing = await findExistingRegistration(userId, match.matchId);
  if (existing) {
    ensureRegistrationEditable(match, existing);
    const registration = await RegistrationModel.findByIdAndUpdate(
      existing._id,
      {
        $set: {
          teamName: payload.teamName,
          captainBgmiId: payload.captainBgmiId,
          captainIgn: payload.captainIgn,
          squadBgmiIds: payload.squadBgmiIds ?? [],
        },
      },
      { new: true }
    ).lean<Registration | null>();
    if (!registration) {
      throw new RegistrationError("Registration not found", 404);
    }
    return {
      registration,
      match,
      updated: true,
    };
  }
  await ensureSlotsAvailable(match.matchId, match.maxSlots);

  const registration = await RegistrationModel.create({
    userId,
    matchId: match.matchId,
    teamName: payload.teamName,
    captainBgmiId: payload.captainBgmiId,
    captainIgn: payload.captainIgn,
    squadBgmiIds: payload.squadBgmiIds ?? [],
    status: RegistrationStatus.PENDING_PAYMENT,
  });

  return {
    registration: registration.toObject(),
    match,
    updated: false,
  };
};

export const registerForMatchAsAdmin = async (
  matchId: string,
  userId: string,
  actor: AuthContext,
  payload?: {
    reference?: string;
    amount?: number;
    method?: string;
    note?: string;
    teamName?: string;
    captainBgmiId?: string;
    captainIgn?: string;
    squadBgmiIds?: string[];
  }
) => {
  await connectDb();

  const match = await findMatchById(matchId);
  if (!match) {
    throw new RegistrationError("Match not found", 404);
  }

  ensureMatchIsJoinable(match);
  await ensureSlotsAvailable(match.matchId, match.maxSlots);
  const existing = await findExistingRegistration(userId, match.matchId);
  if (existing) {
    throw new RegistrationError("User is already registered for this match", 409);
  }
  await ensureEmailVerified(userId);

  const registration = await RegistrationModel.create({
    userId,
    matchId: match.matchId,
    teamName: payload?.teamName,
    captainBgmiId: payload?.captainBgmiId,
    captainIgn: payload?.captainIgn,
    squadBgmiIds: payload?.squadBgmiIds ?? [],
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
