import Link from "next/link";

export const HeroSection = () => (
  <section className="glass-panel neon-border neon-border-flow relative flex items-center justify-center overflow-hidden rounded-3xl px-6 py-16 text-center md:py-20">
    <div className="absolute inset-0 bg-[var(--hero-image)] bg-cover bg-center opacity-8" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(49,255,225,0.16),transparent_58%)]" />
    <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)]/70 via-[var(--bg-primary)]/84 to-[var(--bg-primary)]/95" />
    <div className="relative z-10 mx-auto w-full max-w-3xl space-y-5 text-center">
      <h1 className="text-4xl font-black leading-tight text-[var(--text-primary)] drop-shadow-[0_0_26px_rgba(49,255,225,0.24)] md:text-5xl">
        Skill-based BGMI Tournaments
      </h1>
      <p className="text-lg text-[var(--text-secondary)]">Participate in competitively hosted BGMI custom scrims or host your tournaments and win cash prize.</p>
      <p className="text-lg text-[var(--text-secondary)]">Compete. Win. Get Paid.</p>
      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard"
          className="w-full rounded-xl border border-[color-mix(in_oklab,var(--accent-primary),transparent_38%)] bg-[linear-gradient(115deg,var(--accent-primary),var(--accent-secondary))] px-5 py-3 text-sm font-semibold text-[#02131f] shadow-[0_0_28px_rgba(49,255,225,0.3)] transition hover:brightness-110 sm:w-auto"
        >
          Join Next Match
        </Link>
        <Link
          href="/rules"
          className="w-full rounded-xl border border-[var(--panel-border)] bg-[var(--bg-secondary)]/75 px-5 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--accent-primary)] hover:shadow-[0_0_20px_rgba(49,255,225,0.18)] sm:w-auto"
        >
          View Rules
        </Link>
      </div>
    </div>
  </section>
);

export default HeroSection;
