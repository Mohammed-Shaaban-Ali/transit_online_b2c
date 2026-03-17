"use client";

import { SearchIcon } from "lucide-react";

function ActionButtonsRow() {
  return (
    <div className="mt-4 flex items-center justify-end gap-4">
      <button
        type="button"
        className="min-w-[120px] rounded-sm border border-primary px-8 h-[58px] text-[20px] text-primary transition-colors duration-200 hover:bg-blue-100"
      >
        Flight + Hotel
      </button>
      <button
        type="button"
        className="min-w-[120px] rounded-sm bg-primary px-8 h-[58px] text-[20px] text-white transition-colors duration-200 hover:bg-primary/80 flex items-center gap-2"
      >
        <SearchIcon />
        Search
      </button>
    </div>
  );
}

export default ActionButtonsRow;
