import { ArrowRight } from "lucide-react";

type Props = {
  direction: "Depart" | "Return";
  from: string;
  to: string;
  date: string;
  timeRange: string;
  stops: string;
  onChangeFlight: () => void;
};

export default function SelectedFlightSummary({
  direction,
  from,
  to,
  date,
  timeRange,
  stops,
  onChangeFlight,
}: Props) {
  return (
    <div className="flex items-center justify-between rounded bg-gray-200  p-2.5 mb-2">
      <div className="flex items-center gap-3 text-[14px] text-gray-900">
        <span className="rounded bg-gray-800 text-white px-2.5 py-0.5 text-[13px] font-medium ">
          {direction}
        </span>
        <span className="flex items-center gap-2 font-semibold">
          {from} <ArrowRight size={14} /> {to}
        </span>
        <span className="">{date}</span>
        <span className="">
          {timeRange} ({stops})
        </span>
      </div>
      <button
        type="button"
        onClick={onChangeFlight}
        className="text-[14px] font-medium text-primary  transition-colors cursor-pointer"
      >
        Change Flight
      </button>
    </div>
  );
}
