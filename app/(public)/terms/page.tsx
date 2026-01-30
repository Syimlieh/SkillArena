import { Badge } from "@/components/ui/Badge";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row">
        <aside className="md:sticky md:top-24 md:w-64 md:self-start">
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Terms</div>
          <div className="glass-panel rounded-2xl p-4 text-sm text-[var(--text-primary)]">
            <div className="mb-3 font-semibold text-[var(--text-primary)]">Terms & Conditions</div>
            <p className="text-[var(--text-secondary)]">
              These terms govern account usage, payments, participation, and dispute handling.
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="glass-panel rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="success" className="text-[11px]">Policy</Badge>
              <Badge tone="neutral" className="text-[11px]">Public Page</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-black text-[var(--text-primary)] md:text-4xl">
              Terms & Conditions
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
              By using SkillArena, creating an account, or registering for a match, you agree to the
              terms below. These are separate from gameplay Rules.
            </p>
          </header>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">1. Eligibility</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              You must provide accurate account information and comply with local laws and platform
              policies. We may restrict or suspend accounts that violate these terms.
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">2. Registrations & payments</h2>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
              <p>
                Entry fees are listed on each match page. Once a payment is processed, your slot is
                reserved, subject to match capacity and verification.
              </p>
              <p>
                If a match is canceled by SkillArena, affected entries will be refunded or credited.
                If you withdraw after registration, refunds are not guaranteed.
              </p>
            </div>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">3. Results & verification</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Results are verified using submitted screenshots and match data. We reserve the right
              to reject unclear or fraudulent submissions. Verified results are final.
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">4. Conduct & fair play</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Cheating, exploiting bugs, or disruptive behavior may result in disqualification,
              forfeited prizes, or account suspension.
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">5. Prizes & payouts</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              Prize pools and breakdowns are published per match. Payouts are processed after result
              verification and may require identity or payment confirmation.
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">6. Liability</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              SkillArena is not responsible for connectivity issues, device failures, or third-party
              service interruptions. Participation is at your own risk.
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">7. Changes to terms</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              We may update these terms periodically. Continued use of the platform indicates
              acceptance of the latest version.
            </p>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">8. Contact</h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              For questions about these terms, contact us through the Contact Us page in the footer.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsPage;
