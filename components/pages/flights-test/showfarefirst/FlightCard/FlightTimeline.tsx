import Image, { type StaticImageData } from "next/image";
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

type Props = {
  departureTime: string;
  departureCode: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalCode: string;
  arrivalAirport: string;
  duration: string;
  stops: string;
  airline: string;
  flightNumber: string;
  airlineLogo: StaticImageData | string;
};

export default function FlightTimeline({
  departureTime,
  departureCode,
  departureAirport,
  arrivalTime,
  arrivalCode,
  arrivalAirport,
  duration,
  stops,
  airline,
  flightNumber,
  airlineLogo,
}: Props) {
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
              <div className="h-px flex-1 bg-gray-300" />
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
          className="w-[400px] p-0 rounded-lg"
        >
          {/* Departure */}
          <div className="flex gap-5 px-5 py-3 border-b border-gray-100">
            <p className="text-[15px] font-bold text-gray-900 shrink-0">
              {departureTime}
            </p>
            <p className="text-[14px] font-semibold text-gray-900">
              {departureCode} {departureAirport}
            </p>
          </div>

          {/* Airline info */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
            <Image
              src={airlineLogo}
              alt={airline}
              width={28}
              height={28}
              className="shrink-0 rounded"
            />
            <div>
              <p className="text-[13px] text-gray-500">
                {airline} {flightNumber}
              </p>
              <p className="text-[13px] text-gray-500">
                Flight time: {duration}
              </p>
            </div>
          </div>

          {/* Arrival */}
          <div className="flex gap-5 px-5 py-3">
            <p className="text-[15px] font-bold text-gray-900 shrink-0">
              {arrivalTime}
            </p>
            <p className="text-[14px] font-semibold text-gray-900">
              {arrivalCode} {arrivalAirport}
            </p>
          </div>
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
