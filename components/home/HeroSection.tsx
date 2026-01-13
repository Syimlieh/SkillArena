import Link from "next/link";

export const HeroSection = () => (
  <section className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--card-bg)] px-6 py-16 text-center shadow-2xl md:py-20">
    <div className="absolute inset-0 bg-[var(--hero-image)] bg-cover bg-center opacity-10" />
    <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/90 via-[var(--bg-primary)]/92 to-[var(--bg-primary)]/96" />
    <div className="relative z-10 mx-auto max-w-3xl space-y-4">
      <h1 className="text-4xl font-black leading-tight text-[var(--text-primary)] md:text-5xl">
        Skill-based BGMI Tournaments
      </h1>
      <p className="text-lg text-[var(--text-secondary)]">Participate in competitively hosted BGMI custom scrims or host your tournaments and win cash prize.</p>
      <p className="text-lg text-[var(--text-secondary)]">Compete. Win. Get Paid.</p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard"
          className="w-full rounded-xl bg-[var(--accent-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-secondary)] sm:w-auto"
        >
          Join Next Match
        </Link>
        <Link
          href="/rules"
          className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)] sm:w-auto"
        >
          View Rules
        </Link>
      </div>
    </div>
  </section>
);

export default HeroSection;
