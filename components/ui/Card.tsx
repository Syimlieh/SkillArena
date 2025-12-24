import { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: Props) => {
  return <div className={clsx("glass-panel rounded-2xl p-4", className)}>{children}</div>;
};
