"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  price?: string;
  checked: boolean;
  onCheckedChange: () => void;
  icon?: ReactNode;
  className?: string;
  activeClassName?: string;
};

function FilterCheckboxRow({
  label,
  price,
  checked,
  onCheckedChange,
  icon,
  className,
  activeClassName,
}: Props) {
  return (
    <label
      className={cn(
        "flex cursor-pointer font-normal items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[14px] hover:bg-white transition-colors",
        checked ? activeClassName || "" : " hover:text-primary",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheckedChange}
          className={cn(
            "h-5 w-5 border border-gray-400",
            checked ? "accent-[#0f172a]" : "accent-primary",
          )}
        />
        {icon}
        {label}
      </span>

      {price && <span className="text-[14px] ">{price}</span>}
    </label>
  );
}

export default FilterCheckboxRow;
