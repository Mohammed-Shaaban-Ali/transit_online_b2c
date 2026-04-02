"use client";

function DateRangeField() {
  return (
    <button
      type="button"
      className="flex h-[58px] w-full items-center rounded-sm border border-gray-300 px-3 text-[16px] font-medium"
    >
      Mar 17-Mar 30
      <span className="mx-3 text-gray-400">-</span>
      Mar 18-Apr 22
    </button>
  );
}

export default DateRangeField;
