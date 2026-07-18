"use client";

import { Link } from "@/i18n/navigation";
import type { ComponentType } from "react";
import {
  BedDouble,
  CarFront,
  FerrisWheel,
  Hotel,
  IdCard,
  Plane,
  PlaneTakeoff,
  TrainFront,
} from "lucide-react";
import { useTranslations } from "next-intl";

type MobileServiceItem = {
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
  href?: string;
  active?: boolean;
};

function ServiceCard({ item }: { item: MobileServiceItem }) {
  const Icon = item.icon;
  const bubbleClass = item.active
    ? "bg-primary text-white"
    : "bg-gray-100 text-primary";
  const content = (
    <div className="flex flex-col items-center text-center">
      <span
        className={`inline-flex size-[60px] items-center justify-center rounded-full p-2 ${bubbleClass}`}
      >
        <Icon className="size-8" strokeWidth={1.9} />
      </span>
      <span className="mt-3 text-[13px] font-semibold leading-tight text-[#1A1D29]">
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
  const t = useTranslations("NewPage.mobile.service");
  const firstRow: MobileServiceItem[] = [
    {
      label: t("hotelsHomes"),
      icon: BedDouble,
      href: "/hotels",
      active: true,
    },
    { label: t("flights"), icon: Plane, href: "/flights", active: true },
    {
      label: t("licenses"),
      icon: IdCard,
      href: "/licenses",
      active: true,
    },
    { label: t("trains"), icon: TrainFront },
  ];
  const secondRow: MobileServiceItem[] = [
    {
      label: t("flightHotel"),
      icon: Hotel,
    },
    { label: t("carRentals"), icon: CarFront },
    { label: t("airportTransfers"), icon: PlaneTakeoff },
    { label: t("attractionsTours"), icon: FerrisWheel },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-x-3 gap-y-5">
        {firstRow.map((item) => (
          <ServiceCard key={item.label} item={item} />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-4 gap-x-3 gap-y-5">
        {secondRow.map((item) => (
          <ServiceCard key={item.label} item={item} />
        ))}
      </div>
    </>
  );
}
