"use client";

import { cn } from "@/lib/utils";

type Props = {
  name: string;
  label: string;
  price?: string;
  checked: boolean;
  onCheckedChange: () => void;
  className?: string;
};

function FilterRadioRow({
  name,
  label,
  price,
  checked,
  onCheckedChange,
  className,
}: Props) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[14px] font-normal transition-colors hover:bg-white hover:text-primary",
        checked && "text-primary",
        className,
      )}
    >
      <span className="flex items-center gap-2">
        <input
          type="radio"
          name={name}
          checked={checked}
          onChange={onCheckedChange}
          className="peer sr-only"
        />
        <span
          className={cn(
            "relative size-[16px] rounded-full border-2 border-gray-400 bg-white transition-colors",
            checked && "border-primary",
          )}
        >
          <span
            className={cn(
              "absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-opacity",
              checked ? "opacity-100" : "opacity-0",
            )}
          />
        </span>
        {label}
      </span>
      {price && <span className="text-[14px]">{price}</span>}
    </label>
  );
}

export default FilterRadioRow;
