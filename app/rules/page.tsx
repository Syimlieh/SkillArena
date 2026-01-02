import { Metadata } from "next";
import Link from "next/link";
import { RULES_PAGE_META, RULES_SECTIONS, PENALTY_TABLE } from "@/lib/rules.constants";
import RulesSection from "@/components/rules/RulesSection";
import RulesTable from "@/components/rules/RulesTable";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: RULES_PAGE_META.title,
  description: RULES_PAGE_META.description,
  openGraph: {
    title: RULES_PAGE_META.title,
    description: RULES_PAGE_META.description,
  },
};

const toc = [
  { id: "platform-overview", label: "Overview" },
  { id: "eligibility", label: "Eligibility" },
  { id: "registration", label: "Registration" },
  { id: "format", label: "Match Format" },
  { id: "cheating", label: "Cheating Policy" },
  { id: "result-submission", label: "Result Submission" },
  { id: "prize-distribution", label: "Prize Distribution" },
  { id: "hosted-matches", label: "Hosted Matches" },
  { id: "commission", label: "Commission" },
  { id: "refund-policy", label: "Refund Policy" },
  { id: "disputes", label: "Disputes" },
  { id: "platform-rights", label: "Platform Rights" },
  { id: "disclaimer", label: "Disclaimer" },
];

const RulesPage = () => {
  return (
    <div className="min-h-screen bg-[#050814] text-white">
      <Navbar variant="public" />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12 md:flex-row">
        <aside className="md:sticky md:top-24 md:w-64 md:self-start">
          <div className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--primary)]">Rules</div>
          <div className="rounded-2xl border border-[#1f2937] bg-[#0b1020]/80 p-4 text-sm text-slate-200 shadow-lg shadow-black/30">
            <div className="mb-3 font-semibold text-white">Table of Contents</div>
            <nav className="space-y-2 text-slate-300">
              {toc.map((item) => (
                <div key={item.id}>
                  <Link href={`#${item.id}`} className="hover:text-[var(--primary)]">
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="rounded-2xl border border-[#1f2937] bg-gradient-to-r from-[#0b1020] to-[#0f1a30] p-6 shadow-lg shadow-black/30">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="success" className="text-[11px]">Public</Badge>
              <Badge tone="neutral" className="text-[11px]">Skill-based esports</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-black text-white md:text-4xl">SkillArena Rules & Policies</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Official rules for BGMI custom matches on SkillArena. Please read carefully before registering for any match.
            </p>
            <p className="mt-4 text-xs uppercase tracking-wide text-slate-400">Last updated: March 2025</p>
          </header>

          <div className="space-y-5">
            {RULES_SECTIONS.map((section) => (
              <RulesSection key={section.id} id={section.id} title={section.title} highlight={section.emphasis}>
                {section.id === "cheating" ? (
                  <>
                    {section.body}
                    <RulesTable title="Penalties" rows={PENALTY_TABLE} />
                  </>
                ) : (
                  section.body
                )}
              </RulesSection>
            ))}
          </div>

          <footer className="rounded-2xl border border-[#1f2937] bg-[#0b1020]/70 p-4 text-xs text-slate-400">
            SkillArena is a skill-based esports platform. There is no gambling or betting. For questions, contact support.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default RulesPage;
