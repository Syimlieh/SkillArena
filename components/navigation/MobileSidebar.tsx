import { useEffect, useRef } from "react";
import clsx from "clsx";
import { NavSection, NavItem } from "@/config/navigation";
import SidebarItem from "@/components/navigation/SidebarItem";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sections: NavSection[];
  accountItems: NavItem[];
  activePath: string;
  onAction?: (item: NavItem) => void;
}

const MobileSidebar = ({ isOpen, onClose, sections, accountItems, activePath, onAction }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <div className={clsx("fixed inset-0 z-40 md:hidden", isOpen ? "visible" : "invisible")}>
      <div
        className={clsx(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        ref={containerRef}
        className={clsx(
          "absolute left-0 top-0 h-full w-72 overflow-y-auto border-r border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 transition-transform",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[var(--border-subtle)] px-2 py-1 text-xs text-[var(--text-secondary)]"
          >
            ✕
          </button>
        </div>
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                {section.label}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <SidebarItem
                    key={item.id}
                    item={item}
                    isCollapsed={false}
                    isActive={item.href ? activePath.startsWith(item.href) : false}
                    onAction={onAction}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="space-y-2 border-t border-[var(--border-subtle)] pt-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
              Account
            </div>
            <div className="space-y-1">
              {accountItems.map((item) => (
                <SidebarItem
                  key={item.id}
                  item={item}
                  isCollapsed={false}
                  isActive={item.href ? activePath.startsWith(item.href) : false}
                  onAction={onAction}
                />
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MobileSidebar;
