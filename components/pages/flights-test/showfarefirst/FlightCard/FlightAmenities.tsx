import { MonitorSmartphone, Wifi, Zap } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const amenities = [
  { icon: Wifi, label: "Wi-Fi is available", filled: false },
  { icon: Zap, label: "USB port and power outlet", filled: true },
  {
    icon: MonitorSmartphone,
    label: "Seatback entertainment system",
    filled: false,
  },
];

type Props = {
  airline?: string;
  cabinClass?: string;
  airlineLogo: StaticImageData | string;
};

export default function FlightAmenities({
  airline = "Delta Air Lines",
  cabinClass = "Economy class",
  airlineLogo,
}: Props) {
  return (
    <HoverCard openDelay={200} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div className="mt-1 flex items-center gap-1.5 cursor-pointer">
          {amenities.map((a) => (
            <a.icon
              key={a.label}
              size={13}
              className={`text-primary ${a.filled ? "fill-primary" : ""}`}
            />
          ))}
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        align="start"
        sideOffset={8}
        className="w-72 p-4 rounded-lg"
      >
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={airlineLogo}
            alt={airline}
            width={24}
            height={24}
            className="shrink-0"
          />
          <p className="text-[14px] font-semibold text-gray-900">{airline}</p>
        </div>

        <p className="text-[13px] text-gray-500 mb-1 mt-3">{cabinClass}</p>

        <ul className="space-y-2">
          {amenities.map((a) => (
            <li
              key={a.label}
              className="flex items-center gap-2.5 text-[13px] text-gray-700"
            >
              <a.icon
                size={16}
                className={`text-primary shrink-0 ${a.filled ? "fill-primary" : ""}`}
              />
              {a.label}
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  );
}
