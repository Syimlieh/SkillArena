import { Scrim } from "@/types/scrim.types";

export interface DashboardScrim extends Scrim {
  confirmed: boolean;
  placement?: number;
  prizeWon?: number;
}

export interface DashboardData {
  upcoming: DashboardScrim[];
  history: DashboardScrim[];
  nextJoinable?: Scrim;
}
