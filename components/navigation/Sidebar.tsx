import clsx from "clsx";
import { NavSection, NavItem } from "@/config/navigation";
import SidebarItem from "@/components/navigation/SidebarItem";

interface Props {
  sections: NavSection[];
  accountItems: NavItem[];
  isCollapsed: boolean;
  activePath: string;
  onToggleCollapsed: () => void;
  onAction?: (item: NavItem) => void;
}

const Sidebar = ({ sections, accountItems, isCollapsed, activePath, onToggleCollapsed, onAction }: Props) => (
  <aside
    className={clsx(
      "fixed left-0 top-16 hidden h-[calc(100vh-4rem)] flex-col overflow-hidden border-r border-[var(--panel-border)] bg-[var(--bg-primary)]/85 backdrop-blur-xl transition-[width] duration-[420ms] ease-in-out md:flex",
      isCollapsed ? "w-20" : "w-64"
    )}
  >
    <div className="flex items-center justify-between px-4 py-4">
      <span
        className={clsx(
          "overflow-hidden whitespace-nowrap text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)] transition-all duration-[320ms]",
          isCollapsed ? "max-w-0 -translate-x-1 opacity-0" : "max-w-28 translate-x-0 opacity-100"
        )}
      >
        Navigation
      </span>
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="rounded-lg border border-[var(--panel-border)] bg-[var(--bg-secondary)]/70 px-2 py-1 text-xs text-[var(--text-secondary)] transition hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]"
      >
        {isCollapsed ? "›" : "‹"}
      </button>
    </div>

    <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
      {sections.map((section) => (
        <div key={section.id} className="space-y-2">
          <div
            className={clsx(
              "overflow-hidden px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-all duration-[320ms]",
              isCollapsed ? "max-h-0 -translate-x-1 opacity-0" : "max-h-4 translate-x-0 opacity-100"
            )}
          >
            {section.label}
          </div>
          <div className="space-y-1">
            {section.items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                isActive={item.href ? (item.exactMatch ? activePath === item.href : activePath.startsWith(item.href)) : false}
                onAction={onAction}
              />
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="sticky bottom-0 mt-auto border-t border-[var(--panel-border)] bg-[var(--bg-primary)]/92 px-3 py-4 backdrop-blur">
      <div
        className={clsx(
          "overflow-hidden px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-all duration-[320ms]",
          isCollapsed ? "max-h-0 -translate-x-1 opacity-0" : "max-h-4 translate-x-0 opacity-100"
        )}
      >
        Account
      </div>
      <div className="mt-2 space-y-1">
        {accountItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            isActive={item.href ? (item.exactMatch ? activePath === item.href : activePath.startsWith(item.href)) : false}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  </aside>
);

export default Sidebar;
