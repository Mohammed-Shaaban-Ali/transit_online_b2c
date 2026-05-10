"use client";

import type { ComponentType, ReactNode } from "react";
import {
  Accessibility,
  AlarmClock,
  Baby,
  Bell,
  Building2,
  Car,
  Check,
  Flame,
  LayoutGrid,
  Luggage,
  Shield,
  Shirt,
  Wifi,
} from "lucide-react";
import { MdLocalParking } from "react-icons/md";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type TagKind = "free" | "charge";

function Tag({ kind }: { kind: TagKind }) {
  const t = useTranslations("HotelServicesAmenities.tags");
  return (
    <span
      className={cn(
        "ms-2 inline-flex shrink-0 rounded px-2 py-0.5 text-xs font-medium",
        kind === "free" && "bg-cyan-100 text-teal-800",
        kind === "charge" && "bg-violet-100 text-violet-900",
      )}
    >
      {kind === "free" ? t("free") : t("additionalCharge")}
    </span>
  );
}

function PopularRow({
  icon: Icon,
  label,
  tag,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  tag?: TagKind;
}) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-gray-900">
      <Icon className="mt-0.5 size-4 shrink-0 text-gray-700" aria-hidden />
      <span className="flex min-w-0 flex-wrap items-center gap-x-0">
        <span>{label}</span>
        {tag ? <Tag kind={tag} /> : null}
      </span>
    </li>
  );
}

function CategoryBlock({
  title,
  icon: Icon,
  description,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-4 shrink-0 text-gray-600" aria-hidden />
        <h4 className="text-sm font-bold text-gray-900 md:text-base">
          {title}
        </h4>
      </div>
      {description ? (
        <p className="mb-3 text-sm leading-relaxed text-gray-600">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function CheckRow({ label, tag }: { label: string; tag?: TagKind }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-gray-900">
      <Check
        className="mt-0.5 size-4 shrink-0 text-gray-600"
        strokeWidth={2.5}
        aria-hidden
      />
      <span className="flex min-w-0 flex-wrap items-center gap-x-0">
        <span>{label}</span>
        {tag ? <Tag kind={tag} /> : null}
      </span>
    </li>
  );
}

const ParkingIcon = (props: { className?: string }) => (
  <MdLocalParking className={props.className} aria-hidden />
);

export default function HotelServicesAmenitiesSection() {
  const t = useTranslations("HotelServicesAmenities");

  return (
    <section className="mt-8 rounded-lg border border-gray-100 bg-white  shadow-sm  p-5">
      <h2 className="text-22 font-bold text-gray-900 ">{t("pageTitle")}</h2>

      <div className="mt-4 ">
        <div className="mb-5 flex items-center gap-2">
          <Flame className="size-4 shrink-0 " aria-hidden />
          <h3 className="text-base font-bold text-gray-900">
            {t("popularTitle")}
          </h3>
        </div>
        <div className="grid gap-8 md:grid-cols-3 md:gap-10">
          <ul className="space-y-3">
            <PopularRow
              icon={ParkingIcon}
              label={t("popular.publicParking")}
              tag="charge"
            />
            <PopularRow icon={Check} label={t("popular.serviceRobots")} />
            <PopularRow
              icon={Check}
              label={t("popular.laundryRoom")}
              tag="free"
            />
          </ul>
          <ul className="space-y-3">
            <PopularRow
              icon={Luggage}
              label={t("popular.luggageStorage")}
              tag="free"
            />
            <PopularRow icon={AlarmClock} label={t("popular.wakeUpCall")} />
          </ul>
          <ul className="space-y-3">
            <PopularRow icon={Check} label={t("popular.taxiBooking")} />
            <PopularRow
              icon={Wifi}
              label={t("popular.wifiPublic")}
              tag="free"
            />
          </ul>
        </div>
      </div>

      <div className="mt-8 ">
        <div className="mb-6 flex items-center gap-2">
          <LayoutGrid className="size-4 shrink-0 text-gray-700" aria-hidden />
          <h3 className="text-base font-bold text-gray-900">
            {t("moreTitle")}
          </h3>
        </div>

        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div className="flex flex-col gap-8">
            <CategoryBlock title={t("categories.internet")} icon={Wifi}>
              <ul className="space-y-2.5">
                <CheckRow label={t("more.wifiPublic")} tag="free" />
              </ul>
            </CategoryBlock>

            <CategoryBlock
              title={t("categories.parking")}
              icon={ParkingIcon}
              description={t("more.parkingDescription")}
            >
              <ul className="space-y-2.5">
                <CheckRow label={t("more.publicParking")} tag="charge" />
              </ul>
            </CategoryBlock>

            <CategoryBlock title={t("categories.transportation")} icon={Car}>
              <ul className="space-y-2.5">
                <CheckRow label={t("more.taxiBooking")} />
              </ul>
            </CategoryBlock>

            <CategoryBlock title={t("categories.frontDesk")} icon={Bell}>
              <ul className="space-y-2.5">
                <CheckRow label={t("more.expressCheckin")} />
                <CheckRow label={t("more.safeFrontDesk")} />
                <CheckRow label={t("more.luggageStorage")} tag="free" />
                <CheckRow label={t("more.wakeUpCall")} />
                <CheckRow label={t("more.translationTools")} />
                <CheckRow label={t("more.electronicId")} />
              </ul>
            </CategoryBlock>
          </div>

          <div className="flex flex-col gap-8">
            <CategoryBlock title={t("categories.publicAreas")} icon={Building2}>
              <ul className="space-y-2.5">
                <CheckRow label={t("more.waterPurifier")} />
                <CheckRow label={t("more.elevator")} />
                <CheckRow label={t("more.ventilation")} />
                <CheckRow label={t("more.vendingMachines")} />
                <CheckRow label={t("more.serviceRobots")} />
                <CheckRow label={t("more.noSmokingPublic")} />
                <CheckRow label={t("more.nonSmokingFloor")} />
              </ul>
            </CategoryBlock>

            <CategoryBlock title={t("categories.cleaning")} icon={Shirt}>
              <ul className="space-y-2.5">
                <CheckRow label={t("more.clothesDryer")} />
                <CheckRow label={t("more.clothesSteamer")} />
                <CheckRow label={t("more.laundryRoom")} tag="free" />
                <CheckRow label={t("more.ironingService")} tag="free" />
                <CheckRow label={t("more.laundryOnSite")} tag="free" />
              </ul>
            </CategoryBlock>
          </div>

          <div className="flex flex-col gap-8">
            <CategoryBlock title={t("categories.children")} icon={Baby}>
              <ul className="space-y-2.5">
                <CheckRow label={t("more.childrenSlippers")} />
                <CheckRow label={t("more.childrenToothbrushes")} />
              </ul>
            </CategoryBlock>

            <CategoryBlock
              title={t("categories.accessibility")}
              icon={Accessibility}
            >
              <ul className="space-y-2.5">
                <CheckRow label={t("more.stairFreeEntrance")} />
              </ul>
            </CategoryBlock>

            <CategoryBlock title={t("categories.safety")} icon={Shield}>
              <ul className="space-y-2.5">
                <CheckRow label={t("more.firstAid")} />
                <CheckRow label={t("more.fireAlarm")} />
                <CheckRow label={t("more.keycard")} />
                <CheckRow label={t("more.fireExtinguisher")} />
                <CheckRow label={t("more.securityPersonnel")} />
                <CheckRow label={t("more.intruderAlarm")} />
                <CheckRow label={t("more.smokeDetector")} />
                <CheckRow label={t("more.cctv")} />
                <CheckRow label={t("more.carbonMonoxide")} />
              </ul>
            </CategoryBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
