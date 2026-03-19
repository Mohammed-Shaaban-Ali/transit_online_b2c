"use client";

import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  compact?: boolean;
  className?: string;
  onSearch?: () => void;
};

function ActionButtonsRow({ compact = false, className, onSearch }: Props) {
  if (compact) {
    return (
      <div className={cn("mt-4 flex items-center justify-end", className)}>
        <button
          type="button"
          aria-label="Search"
          onClick={onSearch}
          className="flex h-[58px] w-[58px] items-center justify-center rounded-sm bg-primary text-white transition-colors duration-200 hover:bg-primary/80"
        >
          <SearchIcon size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("mt-4 flex items-center justify-end gap-4", className)}>
      <button
        type="button"
        className="min-w-[120px] rounded-sm border border-primary px-8 h-[58px] text-[20px] text-primary transition-colors duration-200 hover:bg-blue-100"
      >
        Flight + Hotel
      </button>
      <button
        type="button"
        onClick={onSearch}
        className="min-w-[120px] rounded-sm bg-primary px-8 h-[58px] text-[20px] text-white transition-colors duration-200 hover:bg-primary/80 flex items-center gap-2"
      >
        <SearchIcon />
        Search
      </button>
    </div>
  );
}

export default ActionButtonsRow;
