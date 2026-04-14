"use client";

import { Link } from "@/i18n/navigation";
import type { ComponentType } from "react";
import {
  BedDouble,
  CarFront,
  FerrisWheel,
  Hotel,
  Map,
  Plane,
  PlaneTakeoff,
  TrainFront,
} from "lucide-react";

type MobileServiceItem = {
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  href?: string;
  active?: boolean;
};

const firstRow: MobileServiceItem[] = [
  {
    label: "Hotels & Homes",
    icon: BedDouble,
    href: "/new/hotels-test",
    active: true,
  },
  { label: "Flights", icon: Plane, href: "/new/flights-test", active: true },
  {
    label: "Flight + Hotel",
    icon: Hotel,
    href: "/new/flight-hotel",
    active: true,
  },
  { label: "Trains", icon: TrainFront, href: "/new/trains", active: true },
];

const secondRow: MobileServiceItem[] = [
  { label: "Car Rentals", icon: CarFront },
  { label: "Airport Transfers", icon: PlaneTakeoff },
  { label: "Attractions & Tours", icon: FerrisWheel },
  { label: "Travel guides", icon: Map },
];

function ServiceCard({ item }: { item: MobileServiceItem }) {
  const Icon = item.icon;
  const bubbleClass = item.active
    ? "bg-primary text-white"
    : "bg-gray-100 text-primary";
  const content = (
    <div className="flex flex-col items-center text-center">
      <span
        className={`inline-flex size-14 items-center justify-center rounded-full p-2 ${bubbleClass}`}
      >
        <Icon className="size-8" strokeWidth={1.9} />
      </span>
      <span className="mt-3 text-[12px] font-medium leading-tight text-[#1A1D29]">
        {item.label}
      </span>
    </div>
  );

  if (item.href) {
    return (
      <Link href={item.href} className="block">
        {content}
      </Link>
    );
  }

  return <div>{content}</div>;
}

export default function Service() {
  return (
    <>
      <div className="grid grid-cols-4 gap-x-3 gap-y-6">
        {firstRow.map((item) => (
          <ServiceCard key={item.label} item={item} />
        ))}
      </div>

      <div className="mt-7 grid grid-cols-4 gap-x-3 gap-y-6">
        {secondRow.map((item) => (
          <ServiceCard key={item.label} item={item} />
        ))}
      </div>
    </>
  );
}
