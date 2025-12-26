import { Scrim } from "@/types/scrim.types";
import { Match } from "@/types/match.types";

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
}
