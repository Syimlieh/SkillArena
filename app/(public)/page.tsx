import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { HeroActions } from "@/components/home/HeroActions";
import { UpcomingMatches } from "@/components/home/UpcomingMatches";
import { Scrim } from "@/types/scrim.types";
import { ScrimStatus } from "@/enums/ScrimStatus.enum";
import { ScrimMap } from "@/enums/ScrimMap.enum";

const mockScrims: Scrim[] = [
  {
    slug: "erangel-showdown",
    title: "Erangel Showdown",
    entryFee: 80,
    maxSlots: 25,
    availableSlots: 12,
    prizePool: 500,
    status: ScrimStatus.UPCOMING,
    map: ScrimMap.ERANGEL,
    startTime: new Date(Date.now() + 60 * 60 * 1000),
  },
  {
    slug: "livik-blitz",
    title: "Miramar Blitz",
    entryFee: 80,
    maxSlots: 25,
    availableSlots: 4,
    prizePool: 500,
    status: ScrimStatus.UPCOMING,
    map: ScrimMap.LIVIK,
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
  },
  {
    slug: "sanhok-skirmish",
    title: "Sanhok Skirmish",
    entryFee: 80,
    maxSlots: 25,
    availableSlots: 0,
    prizePool: 500,
    status: ScrimStatus.FULL,
    map: ScrimMap.ERANGEL,
    startTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
  },
];

const Hero = () => (
  <section className="relative overflow-hidden rounded-3xl border border-[#0f172a] bg-[radial-gradient(circle_at_20%_20%,rgba(66,255,135,0.12),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(255,153,51,0.14),transparent_32%),linear-gradient(135deg,#0d1117,#111827)] p-10 text-white">
    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-[#0f172a]/50" />
    <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl space-y-4">
        <Badge tone="success">Weekend BGMI Scrims</Badge>
        <h1 className="text-4xl font-black leading-tight text-white md:text-5xl">
          Skill-based tournaments with neon-fast payouts.
        </h1>
        <p className="text-lg text-slate-300">₹80 entry • Verified lobbies • Anti-cheat moderation</p>
        <HeroActions scrims={mockScrims} />
      </div>
      <Card className="w-full max-w-sm border border-[rgba(66,255,135,0.2)] bg-[#0c111a]/80">
        <div className="text-sm uppercase text-slate-400">Prize Highlight</div>
        <div className="mt-3 text-3xl font-black text-[var(--primary)]">₹1,370</div>
        <p className="mt-1 text-sm text-slate-300">Last winning squad: Team Alpha</p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-400">
          <div>
            <div className="text-[var(--primary)] font-semibold">1st</div>
            <div>₹1,370</div>
          </div>
          <div>
            <div className="text-orange-300 font-semibold">2nd</div>
            <div>₹150</div>
          </div>
          <div>
            <div className="text-slate-200 font-semibold">3rd</div>
            <div>₹80</div>
          </div>
        </div>
      </Card>
    </div>
  </section>
);

const Highlights = () => (
  <section className="grid gap-4 md:grid-cols-3">
    {["Anti-cheat Admins", "Secure PhonePe-ready", "Fast Slot Updates"].map((item) => (
      <Card key={item} className="border border-[#0f172a]">
        <div className="text-sm uppercase text-[var(--primary)]">Feature</div>
        <div className="mt-2 text-lg font-semibold text-white">{item}</div>
        <p className="text-sm text-slate-400">Built-in security, instant webhook handling, and role-gated admin tools.</p>
      </Card>
    ))}
  </section>
);

export default function HomePage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10">
      <Hero />
      <UpcomingMatches scrims={mockScrims} />
      <Highlights />
    </div>
  );
}
