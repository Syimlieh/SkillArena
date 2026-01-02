export type HomeMatch = {
  id: string;
  title: string;
  map: string;
  startTime: string;
  entryFee: string;
  prizePool: string;
  status: string;
  matchId?: string;
  href?: string;
};

export const UPCOMING_MATCHES: HomeMatch[] = [
  {
    id: "match-1",
    title: "Erangel Scrim • Sat, 10:45 pm",
    map: "ERANGEL",
    startTime: "Sat, 10:45 pm",
    entryFee: "₹80",
    prizePool: "₹1,600",
    status: "Upcoming",
    matchId: "er-20260129-001",
  },
  {
    id: "match-2",
    title: "Livik Scrim • Sun, 9:15 pm",
    map: "LIVIK",
    startTime: "Sun, 9:15 pm",
    entryFee: "₹80",
    prizePool: "₹1,600",
    status: "Upcoming",
    matchId: "lv-20261220-002",
  },
  {
    id: "match-3",
    title: "Erangel Scrim • Mon, 8:30 pm",
    map: "ERANGEL",
    startTime: "Mon, 8:30 pm",
    entryFee: "₹80",
    prizePool: "₹1,600",
    status: "Upcoming",
    matchId: "er-20261222-003",
  },
];
