import { DashboardData, DashboardScrim } from "@/types/dashboard.types";
import { Scrim } from "@/types/scrim.types";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { getNextAvailableScrim } from "@/modules/scrims/scrim.selector";
import { listScrims } from "@/modules/scrims/scrim.service";

const markConfirmed = (scrim: Scrim): DashboardScrim => ({
  ...scrim,
  confirmed: true,
});

export const getDashboardData = async (): Promise<DashboardData> => {
  const scrims = await listScrims();

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
  };
};
