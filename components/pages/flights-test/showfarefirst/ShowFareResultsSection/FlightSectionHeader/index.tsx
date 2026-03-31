import Image, { StaticImageData } from "next/image";
import { Clock } from "lucide-react";

type Props = {
  phase: "departure" | "return";
  stepNumber: number;
  /** Shown on desktop hero only */
  title: string;
  flightsCount: number;
  backgroundImage: StaticImageData | string;
  /** Subtitle copy for round-trip vs one-way */
  isRoundTrip?: boolean;
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
  isRoundTrip = false,
  selectedDeparture,
  onChangeFlight,
}: Props) {
  const mobileStepTitle =
    phase === "departure" ? "Select departure flight" : "Select return flight";

  const priceSubtitle = isRoundTrip
    ? "Average round-trip price per passenger, taxes and fees included"
    : "Average price per passenger, taxes and fees included";

  return (
    <div className="flex flex-col">
      {/* Mobile: step badge + titles + subtitle (matches booking-step UI) */}
      <div className="lg:hidden pb-3 pt-0.5">
        <div className="flex flex-col gap-2">
          <div className="min-w-0 flex items-center gap-2">
            <div
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary text-[14px] font-bold leading-none text-white"
              aria-hidden
            >
              {stepNumber}
            </div>
            <h2 className="text-[16px] font-bold leading-snug text-gray-900 sm:text-[17px]">
              {mobileStepTitle}
            </h2>
          </div>
          <p className="text-[13px] leading-relaxed text-gray-500 sm:text-[14px]">
            {priceSubtitle}
          </p>
        </div>

        {selectedDeparture && phase === "return" && (
          <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:thin]">
                <span className="shrink-0 rounded bg-primary px-2 py-0.5 text-[11px] font-semibold text-white">
                  Depart
                </span>
                <span className="shrink-0 whitespace-nowrap text-[12px] font-medium text-gray-800 sm:text-[13px]">
                  {selectedDeparture.date} · {selectedDeparture.timeRange}
                </span>
                <span className="shrink-0 text-gray-300" aria-hidden>
                  ·
                </span>
                <span className="inline-flex shrink-0 items-center gap-0.5 text-[12px] text-gray-600 whitespace-nowrap">
                  <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {selectedDeparture.duration}
                </span>
              </div>
              {onChangeFlight && (
                <button
                  type="button"
                  onClick={onChangeFlight}
                  className="shrink-0 text-[13px] font-semibold text-primary"
                >
                  Change
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop: hero banner */}
      <div className="relative hidden overflow-hidden rounded-t-md lg:block">
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

        <div className="relative z-10 px-4 text-white sm:px-5">
          <div className="flex items-center justify-between py-3 sm:py-4">
            <h3 className="text-[18px] font-semibold leading-tight">
              <span className="mr-1">{stepNumber}.</span>
              {title}
            </h3>
            <span className="ml-2 shrink-0 text-[14px] text-white/80">
              {flightsCount} flights found
            </span>
          </div>

          {selectedDeparture && phase === "return" && (
            <div className="mb-3 flex items-center justify-between rounded-sm bg-white p-2 text-black/70">
              <div className="flex flex-wrap items-center gap-3 text-[14px] lg:gap-4">
                <span className="rounded bg-primary px-2.5 py-0.5 text-[13px] font-semibold text-white">
                  Depart
                </span>
                <span>{selectedDeparture.date}</span>
                <span>{selectedDeparture.timeRange}</span>
                <span>
                  {selectedDeparture.fromCity} - {selectedDeparture.toCity}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {selectedDeparture.duration}
                </span>
              </div>
              {onChangeFlight && (
                <button
                  type="button"
                  onClick={onChangeFlight}
                  className="shrink-0 cursor-pointer text-[13px] font-semibold text-primary"
                >
                  Change Flight
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
