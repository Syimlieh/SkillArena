import { Badge } from "@/components/ui/Badge";

const sections = [
  {
    id: "registering",
    title: "Registering for a Match",
    body: [
      "Open the match page and click Register.",
      "Enter your team name and BGMI IDs before confirming.",
    ],
  },
  {
    id: "bgmi-ids",
    title: "Adding BGMI IDs",
    body: [
      "Captain BGMI ID is required for every registration.",
      "You can add up to three more squad BGMI IDs.",
      "IDs must be numeric and unique.",
    ],
  },
  {
    id: "lock-time",
    title: "Registration Lock",
    body: [
      "Edits are allowed until the match starts.",
      "Admins can lock a specific registration at any time.",
      "Once locked or started, BGMI IDs can no longer be changed.",
    ],
  },
  {
    id: "room-details",
    title: "Receiving Match Details",
    body: [
      "Room ID and password are shared before match start.",
      "You will receive an email with the match link and room details.",
      "Room details are visible on the match page for registered teams.",
    ],
  },
  {
    id: "joining-room",
    title: "Joining the Room",
    body: [
      "Use the Room ID and password to join the custom room.",
      "Join only with your registered team members.",
      "If a team slot is assigned, enter the correct team row.",
    ],
  },
  {
    id: "playing",
    title: "Playing the Match",
    body: [
      "Follow the match rules and play fair.",
      "Do not use emulators, hacks, or unauthorized tools.",
    ],
  },
  {
    id: "screenshots",
    title: "Submitting Screenshots",
    body: [
      "After the match, submit a clear screenshot of placement and kills.",
      "Make sure the match ID is visible in the result.",
    ],
  },
  {
    id: "verification",
    title: "Result Verification",
    body: [
      "Hosts review submissions first; admins can review after.",
      "Rejected submissions can be re-uploaded with the correct proof.",
    ],
  },
  {
    id: "winner",
    title: "Winner Announcement & Payout",
    body: [
      "Winners are announced after verification.",
      "Payouts are released only after admin approval.",
      "Prize money is typically credited within 5–30 minutes after results are finalized.",
    ],
  },
];

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row">
        <aside className="md:sticky md:top-24 md:w-64 md:self-start">
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Guide</div>
          <div className="glass-panel rounded-2xl p-4 text-sm text-[var(--text-primary)]">
            <div className="mb-3 font-semibold text-[var(--text-primary)]">How It Works</div>
            <nav className="space-y-2 text-[var(--text-secondary)]">
              {sections.map((item) => (
                <div key={item.id}>
                  <a href={`#${item.id}`} className="hover:text-[var(--primary)]">
                    {item.title}
                  </a>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="glass-panel rounded-2xl p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="success" className="text-[11px]">Beginner-friendly</Badge>
              <Badge tone="neutral" className="text-[11px]">Public Guide</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-black text-[var(--text-primary)] md:text-4xl">
              How Matches Work on SkillArena
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
              A friendly, step-by-step walkthrough so you always know what to do next.
            </p>
          </header>

          <div className="space-y-5">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="glass-panel rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{section.title}</h2>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[var(--text-secondary)]">
                  {section.body.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuidePage;
