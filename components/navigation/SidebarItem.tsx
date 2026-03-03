import Link from "next/link";
import clsx from "clsx";
import { NavItem } from "@/config/navigation";

interface Props {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
  onAction?: (item: NavItem) => void;
}

const SidebarItem = ({ item, isCollapsed, isActive, onAction }: Props) => {
  const Icon = item.icon;
  const classes = clsx(
    "group flex w-full items-center rounded-xl py-2 text-sm font-semibold transition-all duration-[320ms]",
    isCollapsed ? "justify-center gap-0 px-2" : "justify-start gap-3 px-3",
    isActive
      ? "border border-[var(--accent-primary)]/45 bg-[var(--accent-primary)]/13 text-[var(--accent-primary)] shadow-[0_0_18px_rgba(49,255,225,0.18)]"
      : "border border-transparent text-[var(--text-secondary)] hover:border-[var(--panel-border)] hover:bg-[var(--bg-secondary)]/72 hover:text-[var(--text-primary)]"
  );

  const labelClass = clsx(
    "overflow-hidden whitespace-nowrap transition-all duration-[320ms]",
    isCollapsed ? "max-w-0 -translate-x-1 opacity-0" : "max-w-36 translate-x-0 opacity-100"
  );

  if (item.action && onAction) {
    return (
      <button type="button" onClick={() => onAction(item)} className={classes}>
        <Icon className="h-4 w-4" />
        <span className={labelClass}>{item.label}</span>
      </button>
    );
  }

  return (
    <Link href={item.href ?? "#"} className={classes}>
      <Icon className="h-4 w-4" />
      <span className={labelClass}>{item.label}</span>
    </Link>
  );
};

export default SidebarItem;
