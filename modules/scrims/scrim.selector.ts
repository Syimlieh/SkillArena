import { ScrimMap } from "@/enums/ScrimMap.enum";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { Scrim } from "@/types/scrim.types";

const ALLOWED_MAPS = [ScrimMap.ERANGEL, ScrimMap.LIVIK];

const getAvailableSlots = (scrim: Scrim): number => {
  const available = scrim.availableSlots;
  if (typeof available === "number") return available;
  return Math.max(scrim.maxSlots ?? 0, 0);
};

export const getNextAvailableScrim = (scrims: Scrim[]): Scrim | undefined => {
  const filtered = scrims.filter(
    (scrim) =>
      scrim.status === ScrimStatus.UPCOMING &&
      getAvailableSlots(scrim) > 0 &&
      (!scrim.map || ALLOWED_MAPS.includes(scrim.map))
  );

  return filtered.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
};

export const resolveScrimSlug = (scrim: Scrim): string | null => {
  if (scrim.slug) return scrim.slug;
  if (scrim._id) return String(scrim._id);
  if (scrim.title) return scrim.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return null;
};
