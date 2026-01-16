import { Scrim } from "@/types/scrim.types";
import { Match } from "@/types/match.types";
import { RegistrationStatus } from "@/enums/RegistrationStatus.enum";
import { PaymentStatus } from "@/enums/PaymentStatus.enum";

export interface DashboardScrim extends Scrim {
  confirmed: boolean;
  placement?: number;
  prizeWon?: number;
}

export interface DashboardData {
  upcoming: DashboardScrim[];
  history: DashboardScrim[];
  nextJoinable?: Scrim;
  availableMatches: Match[];
  hostedMatches: Match[];
  registeredMatches: RegisteredMatch[];
}

export interface RegisteredMatch {
  match: Match;
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
}
