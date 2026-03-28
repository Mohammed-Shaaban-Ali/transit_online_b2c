import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Leg } from "@/types/flightTypes";
import FlightLeg from "./FlightLeg";

type Props = {
  legs: Leg[];
  departureTime: string;
  departureCode: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalCode: string;
  arrivalAirport: string;
  duration: string;
  stops: string;
};

export default function FlightTimeline({
  legs,
  departureTime,
  departureCode,
  departureAirport,
  arrivalTime,
  arrivalCode,
  arrivalAirport,
  duration,
  stops,
}: Props) {
  const stopsCount = legs.length - 1;

  return (
    <div className="flex flex-1 items-center gap-3 max-w-[320px]">
      <div className="text-start">
        <p className="text-[20px] font-bold leading-tight">{departureTime}</p>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-[14px] text-gray-500 mt-0.5 cursor-pointer">
                {departureCode}
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[13px]">
              {departureAirport}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <HoverCard openDelay={200} closeDelay={150}>
        <HoverCardTrigger asChild>
          <div className="flex-1 px-2 cursor-pointer">
            <p className="text-center text-[12px] text-gray-500 mb-1">
              {duration}
            </p>
            <div className="relative flex items-center">
              <span className="size-[6px] rounded-full border border-gray-400 bg-gray-400 shrink-0" />
              <div className="h-px flex-1 bg-gray-300 relative">
                {stopsCount > 0 &&
                  Array.from({ length: stopsCount }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute top-1/2 -translate-y-1/2 size-2 mt-1 border border-gray-400 bg-white"
                      style={{
                        left: `${((i + 1) / (stopsCount + 1)) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  ))}
              </div>
              <span className="size-[6px] rounded-full border border-gray-400 bg-gray-400 shrink-0" />
            </div>
            <p className="text-center text-[12px] text-gray-500 mt-1">
              {stops}
            </p>
          </div>
        </HoverCardTrigger>

        <HoverCardContent
          align="center"
          sideOffset={10}
          className="w-[420px] p-4 rounded-lg"
        >
          <FlightLeg legs={legs} />
        </HoverCardContent>
      </HoverCard>

      <div className="text-end">
        <p className="text-[20px] font-bold leading-tight">{arrivalTime}</p>
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-[14px] text-gray-500 mt-0.5 cursor-pointer">
                {arrivalCode}
              </p>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-[13px]">
              {arrivalAirport}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
