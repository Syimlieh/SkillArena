const features = [
  {
    title: "Skill-Based Matches",
    desc: "BGMI custom rooms with fair rules and clear scoring.",
  },
  {
    title: "Verified Hosts",
    desc: "Hosts reviewed for accuracy, payouts, and rule compliance.",
  },
  {
    title: "Fast Payouts",
    desc: "Prize pools released promptly after result verification.",
  },
];

export const FeaturesSection = () => (
  <section className="space-y-4">
    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Why SkillArena</h2>
    <div className="grid gap-4 md:grid-cols-3">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card-bg)] p-5 shadow-md"
        >
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{feature.title}</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">{feature.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesSection;
