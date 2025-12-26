import { MatchMap } from "@/enums/MatchMap.enum";
import { MatchModel } from "@/models/Match.model";
import { formatDateId, dayRangeUtc } from "@/lib/helpers/date";
import { Match } from "@/types/match.types";

const mapCode: Record<MatchMap, string> = {
  [MatchMap.ERANGEL]: "ER",
  [MatchMap.LIVIK]: "LV",
  [MatchMap.MIRAMAR]: "MR",
  [MatchMap.SANHOK]: "SK",
  [MatchMap.VIKENDI]: "VD",
};

const buildMatchId = (map: MatchMap, startTime: Date, seq: number): string => {
  const code = mapCode[map];
  const dateId = formatDateId(startTime);
  const paddedSeq = String(seq).padStart(3, "0");
  return `${code}-${dateId}-${paddedSeq}`;
};

export const generateMatchId = async (
  map: MatchMap,
  startTime: Date
): Promise<{ matchId: string; slug: string }> => {
  const { start, end } = dayRangeUtc(startTime);
  const count = await MatchModel.countDocuments({
    map,
    startTime: { $gte: start, $lte: end },
  });
  const matchId = buildMatchId(map, startTime, count + 1);
  return { matchId, slug: matchId.toLowerCase() };
};
