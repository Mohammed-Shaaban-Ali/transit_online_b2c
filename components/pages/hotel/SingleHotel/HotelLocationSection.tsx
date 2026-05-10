"use client";

import type { ComponentType } from "react";
import {
  ChevronRight,
  Landmark,
  ShoppingBag,
  TrainFront,
  UtensilsCrossed,
} from "lucide-react";
import { useTranslations } from "next-intl";

const TRANSPORT = [
  { name: "Metro: Shangcheng Road", distance: "440 m" },
  { name: "Metro: South Pudong Road", distance: "700 m" },
  {
    name: "Airport: Shanghai Hongqiao International Airport",
    distance: "22.6 km",
  },
  {
    name: "Airport: Shanghai Pudong International Airport",
    distance: "36.3 km",
  },
  { name: "Train: Shanghai Railway Station", distance: "9.4 km" },
  { name: "Train: Shanghainan Railway Station", distance: "13.9 km" },
] as const;

const SHOPPING = [
  { name: "Xindalu Square", distance: "<100 m" },
  { name: "NO.1 YACHAN", distance: "230 m" },
  { name: "China Resources Times Square", distance: "250 m" },
  { name: "Xinmei Union Square", distance: "330 m" },
  { name: "Lujiazui 1885 Square", distance: "330 m" },
] as const;

const LANDMARKS = [
  { name: "Shanghai World Financial Center", distance: "1.3 km" },
  { name: "Young-SPACE Hot Spring Hall", distance: "1.3 km" },
  { name: "Top of Shanghai Observatory", distance: "1.4 km" },
  { name: "Shanghai Tower", distance: "1.5 km" },
  { name: "Jin Mao Tower", distance: "1.5 km" },
  { name: "Jinmao Tower Observation Deck", distance: "1.5 km" },
  { name: "Yuanshen Sports Center", distance: "1.7 km" },
  { name: "Pudong Yuanshen Gymnasium", distance: "1.8 km" },
  { name: "Lujiazui", distance: "1.9 km" },
  { name: "Shanghai Museum East", distance: "2.1 km" },
  { name: "Shanghai Ocean Aquarium", distance: "2.1 km" },
  { name: "Shanghai Oriental Art Center", distance: "2.2 km" },
  { name: "Oriental Pearl Radio & Television Tower", distance: "2.2 km" },
] as const;

const DINING = [
  { name: "1192 Old Shanghai Style Street", distance: "750 m" },
  { name: "IMPRESSION GALLERY & DINING", distance: "1.5 km" },
  {
    name: "Kathleen's Waitan Western Restaurant (Waitan Branch)",
    distance: "1.6 km",
  },
  { name: "外滩8号 whisky bar (金延大厦店)", distance: "2.7 km" },
  { name: "Meet the Bund Skyline", distance: "2.9 km" },
  { name: "Roosevelt Sky Bar", distance: "3.1 km" },
  { name: "The Cathay Room", distance: "3.1 km" },
  { name: "Cheng long hang", distance: "3.3 km" },
  { name: "ROOF", distance: "3.4 km" },
  { name: "8½ Otto e Mezzo BOMBANA Shanghai", distance: "3.4 km" },
  {
    name: "Lao Long Tang Noodle Restaurant (Guangdong Road Branch)",
    distance: "3.6 km",
  },
  { name: "THE BVLGARI BAR", distance: "4.0 km" },
] as const;

type Poi = { readonly name: string; readonly distance: string };

function LocationBlock({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  items: readonly Poi[];
}) {
  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="size-[18px] shrink-0 text-gray-700" aria-hidden />
        <h3 className="text-lg font-bold text-gray-900 ">{title}</h3>
      </div>
      <ul className="space-y-2.5">
        {items.map((row, i) => (
          <li
            key={`${row.name}-${i}`}
            className="flex justify-between gap-3 text-[14px] leading-snug"
          >
            <span className="min-w-0 text-gray-500">{row.name}</span>
            <span className="shrink-0 text-end text-gray-500">
              {row.distance}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Props = {
  latitude?: number;
  longitude?: number;
  onShowMap?: () => void;
};

export default function HotelLocationSection({
  latitude,
  longitude,
  onShowMap,
}: Props) {
  const t = useTranslations("HotelLocation");

  const mapHref =
    latitude != null && longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
      : undefined;

  return (
    <section className="mt-8 rounded-lg border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      <h2 className="text-22 font-bold text-gray-900 md:text-2xl">
        {t("title")}
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col gap-8">
          <LocationBlock
            title={t("transport")}
            icon={TrainFront}
            items={TRANSPORT}
          />
          <LocationBlock
            title={t("shopping")}
            icon={ShoppingBag}
            items={SHOPPING}
          />
        </div>
        <LocationBlock
          title={t("landmarks")}
          icon={Landmark}
          items={LANDMARKS}
        />
        <LocationBlock
          title={t("dining")}
          icon={UtensilsCrossed}
          items={DINING}
        />
      </div>

      <div className="mt-8 flex justify-center border-t border-gray-100 pt-6">
        {mapHref && onShowMap ? (
          <button
            type="button"
            onClick={onShowMap}
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
          >
            {t("showOnMap")}
            <span
              className="flex size-7 items-center justify-center rounded-full border border-primary text-primary"
              aria-hidden
            >
              <ChevronRight className="size-4" strokeWidth={2.5} />
            </span>
          </button>
        ) : mapHref ? (
          <a
            href={mapHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary hover:underline"
          >
            {t("showOnMap")}
            <span
              className="flex size-7 items-center justify-center rounded-full border border-primary text-primary"
              aria-hidden
            >
              <ChevronRight className="size-4" strokeWidth={2.5} />
            </span>
          </a>
        ) : (
          <span className="inline-flex items-center gap-2 text-sm text-gray-400">
            {t("showOnMap")}
            <span
              className="flex size-7 items-center justify-center rounded-full border border-gray-200 text-gray-300"
              aria-hidden
            >
              <ChevronRight className="size-4" strokeWidth={2.5} />
            </span>
          </span>
        )}
      </div>
    </section>
  );
}
