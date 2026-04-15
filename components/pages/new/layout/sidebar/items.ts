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
    disabled?: boolean;
};

type SidebarT = ReturnType<typeof useTranslations>;

const getSidebarItems = (t: SidebarT): SidebarItem[][] => [
    [
        {
            label: t("hotelsHomes"),
            href: "/new/hotels",
            icon: BedDouble,
            disabled: false,

        },
        {
            label: t("flights"),
            href: "/new/flights",
            icon: Plane,
            disabled: false,
        },
        {
            label: t("trains"),
            href: "/new/trains",
            icon: TrainFront, disabled: true,

        },
        {
            label: t("cars"),
            href: "/new/cars",
            icon: CarFront,
            disabled: true,
        },
        {
            label: t("attractionsTours"),
            href: "/new/attractions",
            icon: FerrisWheel,
            disabled: true,
        },
        {
            label: t("flightHotel"),
            href: "/new/flight-hotel",
            icon: Hotel,
            disabled: true,
        },
    ],
    [
        {
            label: t("privateTours"),
            href: "/new/private-tours",
            icon: Luggage,
            disabled: true,
        },
        {
            label: t("groupTours"),
            href: "/new/group-tours",
            icon: Flag,
            disabled: true,
        },
    ],
    [
        {
            label: t("tripPlanner"),
            href: "/new/planner",
            icon: Route,
            isNew: true,
            disabled: true,
        },
        {
            label: t("travelInspiration"),
            href: "/new/inspiration",
            icon: Lightbulb,
            disabled: true,
        },
        {
            label: t("map"),
            href: "/new/map",
            icon: MapPinned,
            disabled: true,
        },
        {
            label: t("deals"),
            href: "/new/deals",
            icon: BadgePercent,
            disabled: true,
        },
    ],
    [
        {
            label: t("rewards"),
            href: "/new/rewards",
            icon: CircleDollarSign,
            disabled: true,
        },
        {
            label: t("app"),
            href: "/new/app",
            icon: Smartphone,
            disabled: true,
        },
    ],
];
export default getSidebarItems;

