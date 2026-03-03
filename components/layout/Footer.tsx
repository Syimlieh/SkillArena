export const Footer = () => (
  <footer className="border-t border-[var(--panel-border)] bg-[var(--bg-primary)]/86 text-[var(--text-secondary)] backdrop-blur">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm md:flex-row md:items-center md:justify-between">
      <span>BGMI Scrims • Competitive community scrims</span>
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <a href="/contact" className="hover:text-[var(--accent-primary)]">
          Contact Us
        </a>
        <a href="/about" className="hover:text-[var(--accent-primary)]">
          About Us
        </a>
        <a href="/terms" className="hover:text-[var(--accent-primary)]">
          Terms & Conditions
        </a>
        <a href="/rules" className="hover:text-[var(--accent-primary)]">
          Rules
        </a>
      </div>
    </div>
  </footer>
);
