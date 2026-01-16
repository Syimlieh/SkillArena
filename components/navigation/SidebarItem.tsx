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
    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-[var(--accent-primary)]/15 text-[var(--accent-primary)]"
      : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
  );

  if (item.action && onAction) {
    return (
      <button type="button" onClick={() => onAction(item)} className={classes}>
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span>{item.label}</span>}
      </button>
    );
  }

  return (
    <Link href={item.href ?? "#"} className={classes}>
      <Icon className="h-4 w-4" />
      {!isCollapsed && <span>{item.label}</span>}
    </Link>
  );
};

export default SidebarItem;
