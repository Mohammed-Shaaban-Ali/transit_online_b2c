import Image, { StaticImageData } from "next/image";
import { Clock, Pencil } from "lucide-react";

type Props = {
  phase: "departure" | "return";
  stepNumber: number;
  title: string;
  flightsCount: number;
  backgroundImage: StaticImageData | string;
  selectedDeparture?: {
    from: string;
    to: string;
    fromCity: string;
    toCity: string;
    date: string;
    timeRange: string;
    duration: string;
    stops: string;
  } | null;
  onChangeFlight?: () => void;
};

export default function FlightSectionHeader({
  phase,
  stepNumber,
  title,
  flightsCount,
  backgroundImage,
  selectedDeparture,
  onChangeFlight,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-t-md">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="header background"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-[#0f2a54]/95 to-primary/95" />
      </div>

      <div className="relative z-10 px-5 text-white">
        <div className="flex items-center justify-between py-4">
          <h3 className="text-[18px] font-semibold ">
            <span className="mr-1">{stepNumber}.</span>
            {title}
          </h3>
          <span className="text-[14px] text-white/80">
            {flightsCount} flights found
          </span>
        </div>

        {selectedDeparture && phase === "return" && (
          <div className="flex items-center justify-between p-2 bg-white rounded-sm text-black/70 mb-3">
            <div className="flex items-center gap-4 text-[14px]">
              <span className="rounded bg-primary px-2.5 py-0.5 text-[13px] font-semibold text-white ">
                Depart
              </span>
              <span className="">{selectedDeparture.date}</span>
              <span className="">{selectedDeparture.timeRange}</span>
              <span className="">
                {selectedDeparture.fromCity} - {selectedDeparture.toCity}
              </span>
              <span className="flex items-center gap-1 ">
                <Clock size={13} />
                {selectedDeparture.duration}
              </span>
            </div>
            {onChangeFlight && (
              <button
                type="button"
                onClick={onChangeFlight}
                className="flex items-center gap-1.5  text-[13px] text-primary  font-semibold cursor-pointer"
              >
                Change Flight
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
