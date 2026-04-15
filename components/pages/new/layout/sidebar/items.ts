import type { LucideIcon } from "lucide-react";
import type { useTranslations } from "next-intl";
import {
    BadgePercent,
    BedDouble,
    CarFront,
    CircleDollarSign,
    FerrisWheel,
    Flag,
    Hotel,
    Lightbulb,
    Luggage,
    MapPinned,
    Plane,
    Route,
    Smartphone,
    TrainFront,
} from "lucide-react";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  isNew?: boolean;
};

type SidebarT = ReturnType<typeof useTranslations>;

const getSidebarItems = (t: SidebarT): SidebarItem[][] => [
    [
        {
            label: t("hotelsHomes"),
            href: "/new/hotels-test",
            icon: BedDouble,
        },
        {
            label: t("flights"),
            href: "/new/flights-test",
            icon: Plane,
        },
        {
            label: t("trains"),
            href: "/new/trains",
            icon: TrainFront,
        },
        {
            label: t("cars"),
            href: "/new/cars",
            icon: CarFront,
        },
        {
            label: t("attractionsTours"),
            href: "/new/attractions",
            icon: FerrisWheel,
        },
        {
            label: t("flightHotel"),
            href: "/new/flight-hotel",
            icon: Hotel,
        },
    ],
    [
        {
            label: t("privateTours"),
            href: "/new/private-tours",
            icon: Luggage,
        },
        {
            label: t("groupTours"),
            href: "/new/group-tours",
            icon: Flag,
        },
    ],
    [
        {
            label: t("tripPlanner"),
            href: "/new/planner",
            icon: Route,
            isNew: true,
        },
        {
            label: t("travelInspiration"),
            href: "/new/inspiration",
            icon: Lightbulb,
        },
        {
            label: t("map"),
            href: "/new/map",
            icon: MapPinned,
        },
        {
            label: t("deals"),
            href: "/new/deals",
            icon: BadgePercent,
        },
    ],
    [
        {
            label: t("rewards"),
            href: "/new/rewards",
            icon: CircleDollarSign,
        },
        {
            label: t("app"),
            href: "/new/app",
            icon: Smartphone,
        },
    ],
];
export default getSidebarItems;

