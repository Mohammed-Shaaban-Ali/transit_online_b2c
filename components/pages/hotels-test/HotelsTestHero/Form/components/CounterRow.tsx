"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  /** Tighter type scale (e.g. mobile bottom sheet) */
  compact?: boolean;
};

function CounterRow({
  title,
  subtitle,
  value,
  onMinus,
  onPlus,
  compact = false,
}: Props) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p
          className={`mb-0.5 font-medium ${compact ? "text-[13px]" : "text-[14px]"}`}
        >
          {title}
        </p>
        <p
          className={`text-gray-500 ${compact ? "text-[11px]" : "text-[12px]"}`}
        >
          {subtitle}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onMinus}
          className="flex h-6 w-6 items-center justify-center rounded-full 
          border border-primary text-primary transition-colors 
          hover:bg-primary hover:text-white cursor-pointer"
        >
          <MinusIcon size={16} />
        </button>
        <span
          className={`w-6 text-center leading-none ${compact ? "text-[15px]" : "text-[16px]"}`}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onPlus}
          className="flex h-6 w-6 items-center justify-center rounded-full 
          border border-primary text-primary transition-colors 
          hover:bg-primary hover:text-white cursor-pointer"
        >
          <PlusIcon size={16} />
        </button>
      </div>
    </div>
  );
}

export default CounterRow;
