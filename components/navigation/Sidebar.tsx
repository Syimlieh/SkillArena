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
      "fixed left-0 top-16 hidden h-[calc(100vh-4rem)] flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur md:flex",
      isCollapsed ? "w-20" : "w-64"
    )}
  >
    <div className="flex items-center justify-between px-4 py-4">
      {!isCollapsed && <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Navigation</span>}
      <button
        type="button"
        onClick={onToggleCollapsed}
        className="rounded-lg border border-[var(--border-subtle)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]"
      >
        {isCollapsed ? "›" : "‹"}
      </button>
    </div>

    <div className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
      {sections.map((section) => (
        <div key={section.id} className="space-y-2">
          {!isCollapsed && (
            <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              {section.label}
            </div>
          )}
          <div className="space-y-1">
            {section.items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
                isActive={item.href ? activePath.startsWith(item.href) : false}
                onAction={onAction}
              />
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="sticky bottom-0 mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 px-3 py-4 backdrop-blur">
      {!isCollapsed && (
        <div className="px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
          Account
        </div>
      )}
      <div className="mt-2 space-y-1">
        {accountItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
            isActive={item.href ? activePath.startsWith(item.href) : false}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  </aside>
);

export default Sidebar;
