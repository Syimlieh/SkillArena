import { Badge } from "@/components/ui/Badge";
import { MATCH_DEFAULTS } from "@/lib/constants";
import { CONTACT_EMAILS, CONTACT_PHONE } from "@/lib/site.constants";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row">
        <aside className="md:sticky md:top-24 md:w-64 md:self-start">
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Contact</div>
          <div className="glass-panel rounded-2xl p-4 text-sm text-[var(--text-primary)]">
            <div className="mb-3 font-semibold text-[var(--text-primary)]">Get in touch</div>
            <p className="text-[var(--text-secondary)]">
              We are here to help with registrations, payments, and match issues.
            </p>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="glass-panel rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="success" className="text-[11px]">Support</Badge>
              <Badge tone="neutral" className="text-[11px]">Public Page</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-black text-[var(--text-primary)] md:text-4xl">Contact SkillArena</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
              Reach out for match help, payment issues, or account support. We respond as quickly as possible.
            </p>
          </header>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contact Details</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2 text-sm text-[var(--text-secondary)]">
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
                <div className="text-xs uppercase tracking-wide text-[var(--primary)]">Email</div>
                <ul className="mt-2 space-y-1">
                  {CONTACT_EMAILS.map((email) => (
                    <li key={email}>
                      <a href={`mailto:${email}`} className="text-[var(--text-primary)] hover:text-[var(--accent-primary)]">
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-4">
                <div className="text-xs uppercase tracking-wide text-[var(--primary)]">Phone</div>
                <div className="mt-2 text-[var(--text-primary)]">{CONTACT_PHONE}</div>
                <div className="mt-2 text-xs text-[var(--text-secondary)]">Support hours: 10:00 AM – 8:00 PM IST</div>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">What we can help with</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
              <li>Match registrations and slot issues.</li>
              <li>Payment confirmations and receipt queries.</li>
              <li>Room ID/password access and match start timing.</li>
              <li>Result submission and verification questions.</li>
            </ul>
          </section>

          <section className="glass-panel rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Products & Pricing</h2>
            <div className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
              <p>SkillArena provides BGMI custom scrim matches and hosted tournaments.</p>
              <p className="text-[var(--text-primary)] font-semibold">Pricing (INR)</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Match entry fees start at ₹{MATCH_DEFAULTS.entryFee}. Exact pricing is shown on each match page.</li>
                <li>Prize pools and payout splits are listed per match in INR.</li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ContactPage;
