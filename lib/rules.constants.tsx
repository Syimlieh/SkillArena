import { ReactNode } from "react";

export interface RuleItem {
  title: string;
  body: ReactNode;
  id: string;
  emphasis?: boolean;
}

export interface RulesTableRow {
  label: string;
  action: string;
}

export const RULES_PAGE_META = {
  title: "Rules & Policies | SkillArena",
  description:
    "Official rules, policies, and fair play guidelines for SkillArena BGMI custom matches. Learn about eligibility, registration, hosted matches, refunds, and cheating policies.",
};

export const RULES_SECTIONS: RuleItem[] = [
  {
    id: "platform-overview",
    title: "Platform Overview",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>SkillArena is a skill-based esports platform for BGMI custom matches.</li>
        <li>Matches are skill-based competitions — no element of chance, betting, or gambling.</li>
        <li>SkillArena acts as the platform, payment collector (escrow), rule enforcer.</li>
      </ul>
    ),
  },
  {
    id: "eligibility",
    title: "Eligibility & Account Rules",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>Players must be 18 years or older.</li>
        <li>Players must use their correct BGMI IGN.</li>
        <li>Violation may result in disqualification or permanent ban.</li>
      </ul>
    ),
  },
  {
    id: "registration",
    title: "Match Registration Rules",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>Entry fees must be paid only via SkillArena; direct payments to hosts are strictly prohibited.</li>
        <li>Registration is confirmed only after successful payment.</li>
        <li>Slots are limited and filled on a first-come, first-served basis.</li>
        <li>Once a match starts, registrations are closed.</li>
      </ul>
    ),
  },
  {
    id: "format",
    title: "Match Format",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>Game: Battlegrounds Mobile India (BGMI)</li>
        <li>Mode: Squad</li>
        <li>Maps: Erangel / Livik (as announced)</li>
        <li>Room Type: Custom Room</li>
        <li>Slot Count: As specified per match</li>
        <li>Room ID and password are shared before match start.</li>
      </ul>
    ),
  },
  {
    id: "cheating",
    title: "Fair Play & Cheating Policy",
    emphasis: true,
    body: (
      <div className="space-y-3">
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-rose-300">Strictly Prohibited</div>
          <ul className="list-disc space-y-1 pl-5 text-slate-200">
            <li>Hacks, mods, modified APKs, emulators.</li>
            <li>Third-party plugins or scripts;</li>
            <li>Fake or edited screenshots; stream sniping.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "result-submission",
    title: "Result Submission & Verification",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>Submit valid screenshots showing placement, kill count, and match ID.</li>
        <li>Results are verified by SkillArena Admin or Host (subject to admin review).</li>
        <li>Failure to submit proof leads to disqualification.</li>
        <li>If the declared winner is found cheating or violating rules, the next eligible team/player is promoted to winner and payouts adjust accordingly.</li>
      </ul>
    ),
  },
  {
    id: "prize-distribution",
    title: "Prize Distribution",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>Prize pool and breakdown are pre-declared.</li>
        <li>Prizes are released only after verification.</li>
        <li>Payments are made via UPI / bank transfer.</li>
        <li>Incorrect payment details may cause delays.</li>
      </ul>
    ),
  },
  {
    id: "hosted-matches",
    title: "Hosted Matches",
    emphasis: true,
    body: (
      <div className="space-y-2">
        <p className="text-slate-200">Some matches on SkillArena are hosted by verified third-party Hosts.</p>
        <div className="rounded-xl border border-[rgba(66,255,135,0.4)] bg-[rgba(66,255,135,0.12)] p-3 text-slate-100">
          <div className="text-xs uppercase tracking-wide text-[var(--primary)]">Payment & Escrow</div>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>All entry fees are collected by SkillArena and held in escrow.</li>
            <li>Hosts never receive player payments directly.</li>
            <li>Hosts are paid only after match completion and verification.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-3 text-slate-200">
          <div className="text-xs uppercase tracking-wide text-slate-400">Host Responsibilities</div>
          <ul className="mt-2 list-disc space-y-1 pl-4">
            <li>Create matches accurately and host fair custom rooms.</li>
            <li>Submit correct results and follow all SkillArena rules.</li>
            <li>Hosts cannot change match details after publishing, collect money directly, or bypass platform rules.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "commission",
    title: "Commission & Host Payouts",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>SkillArena charges a platform commission (3–5%), deducted from match earnings.</li>
        <li>Host earnings are released after winners are paid; payouts may be batched (daily/weekly).</li>
        <li>SkillArena may withhold payouts in case of violations.</li>
      </ul>
    ),
  },
  {
    id: "refund-policy",
    title: "Refund Policy",
    emphasis: true,
    body: (
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[#1f2937] bg-[#0c111a] p-3">
          <div className="text-xs uppercase tracking-wide text-rose-300">No Refunds If</div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-200">
            <li>Match has already started.</li>
            <li>Player fails to join the room.</li>
            <li>Player is disqualified due to rule violations.</li>
            <li>Internet/device issues on player side.</li>
            <li>Incorrect IGN provided.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-[rgba(66,255,135,0.4)] bg-[rgba(66,255,135,0.12)] p-3">
          <div className="text-xs uppercase tracking-wide text-[var(--primary)]">Refunds Allowed If</div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-100">
            <li>Match is cancelled by SkillArena or Host.</li>
            <li>Incorrect room details are shared.</li>
            <li>Server issues occur before match start.</li>
            <li>Platform technical failure prevents participation.</li>
            <li>Gateway charges are non-refundable.</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    id: "disputes",
    title: "Dispute Resolution",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>Disputes must be raised within 24 hours; evidence may be required.</li>
        <li>Admin decision is final and binding.</li>
      </ul>
    ),
  },
  {
    id: "platform-rights",
    title: "Platform Rights",
    body: (
      <ul className="list-disc space-y-1 pl-5 text-slate-200">
        <li>SkillArena may cancel or reschedule matches; disqualify players or hosts.</li>
        <li>SkillArena may withhold payouts or modify rules with notice.</li>
      </ul>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    body: (
      <p className="text-slate-200">
        SkillArena hosts skill-based esports competitions only. There is no gambling, betting, or chance-based gameplay. Entry fees are
        charged for participation and platform services.
      </p>
    ),
  },
];

export const PENALTY_TABLE: RulesTableRow[] = [
  { label: "Minor violation", action: "Warning or disqualification" },
  { label: "Cheating", action: "Immediate disqualification" },
  { label: "Repeat offense", action: "Permanent ban" },
  { label: "Fraud", action: "Prize forfeiture + account termination" },
];
