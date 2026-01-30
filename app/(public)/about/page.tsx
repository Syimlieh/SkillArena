import { Badge } from "@/components/ui/Badge";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row">
        <aside className="md:sticky md:top-24 md:w-64 md:self-start">
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">About</div>
          <div className="glass-panel rounded-2xl p-4 text-sm text-[var(--text-primary)]">
            <div className="mb-3 font-semibold text-[var(--text-primary)]">SkillArena</div>
            <p className="text-[var(--text-secondary)]">
              Community-run BGMI scrims with clear rules, transparent pricing, and verified results.
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="glass-panel rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="success" className="text-[11px]">Community</Badge>
              <Badge tone="neutral" className="text-[11px]">Verification-ready</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-black text-[var(--text-primary)] md:text-4xl">About SkillArena</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
              SkillArena hosts competitive BGMI scrims where teams can register quickly, pay securely,
              and track results with confidence.
            </p>
          </header>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Who we are</h2>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
              <p>
                We are a tournament ops and community team focused on fair play, clear communication,
                and a smooth registration experience.
              </p>
              <p>
                Every match page lists the entry fee, total prize pool, and exact prize breakdown so
                players know what to expect before joining.
              </p>
            </div>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">What we run</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
              <li>BGMI custom scrims with scheduled start times.</li>
              <li>Verified results and placements after each match.</li>
              <li>Clear room ID/password delivery before match start.</li>
              <li>Support for registration edits before match lock.</li>
            </ul>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Verification & fair play</h2>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
              <p>
                We verify results using submitted screenshots and placement details before
                confirming winners.
              </p>
              <p>
                Any disputes are reviewed against match rules and submitted evidence to ensure a
                consistent and transparent outcome.
              </p>
            </div>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Need help?</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              If you have questions about pricing, payments, or match verification, please visit the
              Contact Us page and our Rules page in the footer.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;
