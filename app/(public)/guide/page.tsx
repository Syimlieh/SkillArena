import { Badge } from "@/components/ui/Badge";

const sections = [
  {
    id: "create-account",
    title: "Create Your Account",
    body: [
      "Open the login page and click Create an account.",
      "Complete signup to access the dashboard.",
    ],
    image: "/how-to/step-01-create-account.png",
    imageAlt: "Login page highlighting the Create an account link.",
  },
  {
    id: "open-profile",
    title: "Open Your Profile Menu",
    body: [
      "Click your avatar/name in the top-right.",
      "Open the Profile option from the dropdown.",
    ],
    image: "/how-to/step-02-open-profile-menu.png",
    imageAlt: "Dashboard header showing the profile dropdown menu.",
  },
  {
    id: "verify-email",
    title: "Verify Your Email",
    body: [
      "Use Resend verification inside your profile.",
      "Verify before registering for matches.",
    ],
    image: "/how-to/step-03-verify-email.png",
    imageAlt: "Profile modal showing the resend verification option.",
  },
  {
    id: "find-match",
    title: "Find a Match on the Dashboard",
    body: [
      "Browse Available Matches on your dashboard.",
      "Open a match card to view details.",
    ],
    image: "/how-to/step-04-dashboard-available-match.png",
    imageAlt: "Player dashboard highlighting an available match card.",
  },
  {
    id: "open-match",
    title: "Open the Match Page",
    body: [
      "Review match details and entry fee.",
      "Click Register to begin.",
    ],
    image: "/how-to/step-05-open-match-register.png",
    imageAlt: "Match page with the Register button highlighted.",
  },
  {
    id: "captain-details",
    title: "Enter Captain Details",
    body: [
      "Add your team name and captain BGMI ID.",
      "Captain BGMI ID is required and must be numeric.",
    ],
    image: "/how-to/step-06-captain-bgmi-id.png",
    imageAlt: "Registration form highlighting the captain BGMI ID field.",
  },
  {
    id: "squad-ids",
    title: "Add Squad BGMI IDs",
    body: [
      "Optional: add up to three additional BGMI IDs.",
      "All IDs must be unique.",
    ],
    image: "/how-to/step-07-squad-bgmi-ids.png",
    imageAlt: "Registration form showing squad BGMI ID fields.",
  },
  {
    id: "save-registration",
    title: "Save Your Registration",
    body: [
      "Agree to the rules and save your registration.",
      "You can edit until the match starts.",
    ],
    imageAlt: "Registration modal with Save Registration button.",
  },
  {
    id: "edit-registration",
    title: "Edit Registration Before Start",
    body: [
      "Use Edit Registration if you need changes before kickoff.",
      "After lock or match start, edits are disabled.",
    ],
    image: "/how-to/step-09-edit-registration.png",
    imageAlt: "Match page showing the Edit Registration button.",
  },
  {
    id: "room-details",
    title: "Receive Room Details",
    body: [
      "Room ID and password are shared before match start.",
      "Check your email for the room details message.",
    ],
    image: "/how-to/step-10-room-details-email.png",
    imageAlt: "Email showing room ID and password details.",
  },
  {
    id: "submit-result",
    title: "Submit Your Result",
    body: [
      "Upload a clear result screenshot after the match.",
      "Confirm the screenshot is genuine and submit.",
    ],
    image: "/how-to/step-11-submit-result.png",
    imageAlt: "Result submission section with upload and submit buttons.",
  },
  {
    id: "result-proof",
    title: "Capture Result Screenshot",
    body: [
      "Make sure placement and team names are visible.",
      "Screenshots must clearly show the win screen.",
    ],
    image: "/how-to/step-12-result-screenshot.png",
    imageAlt: "BGMI winner screen example with highlighted player names.",
  },
  {
    id: "winner",
    title: "Check Results & Winners",
    body: [
      "Results appear in Recent Match Results.",
      "Winners are announced after verification.",
    ],
    image: "/how-to/step-13-winner-card.png",
    imageAlt: "Recent match results card highlighting the winner tag.",
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
                {section.image ? (
                  <figure className="mt-5 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] md:max-w-4xl">
                    <img
                      src={section.image}
                      alt={section.imageAlt ?? section.title}
                      className="h-auto w-full object-cover"
                      loading="lazy"
                    />
                  </figure>
                ) : null}
              </section>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default GuidePage;
