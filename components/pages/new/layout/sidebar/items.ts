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
    IdCard,
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
            href: "/hotels",
            icon: BedDouble,
            disabled: false,

        },
        {
            label: t("flights"),
            href: "/flights",
            icon: Plane,
            disabled: false,
        },
        {
            label: t("licenses"),
            href: "/licenses",
            icon: IdCard,
            disabled: false,
        },
        {
            label: t("trains"),
            href: "/trains",
            icon: TrainFront, disabled: true,

        },
        {
            label: t("cars"),
            href: "/cars",
            icon: CarFront,
            disabled: true,
        },
        {
            label: t("attractionsTours"),
            href: "/attractions",
            icon: FerrisWheel,
            disabled: true,
        },
        {
            label: t("flightHotel"),
            href: "/flight-hotel",
            icon: Hotel,
            disabled: true,
        },
    ],
    [
        {
            label: t("privateTours"),
            href: "/private-tours",
            icon: Luggage,
            disabled: true,
        },
        {
            label: t("groupTours"),
            href: "/group-tours",
            icon: Flag,
            disabled: true,
        },
    ],
    [
        {
            label: t("tripPlanner"),
            href: "/planner",
            icon: Route,
            isNew: true,
            disabled: true,
        },
        {
            label: t("travelInspiration"),
            href: "/inspiration",
            icon: Lightbulb,
            disabled: true,
        },
        {
            label: t("map"),
            href: "/map",
            icon: MapPinned,
            disabled: true,
        },
        {
            label: t("deals"),
            href: "/deals",
            icon: BadgePercent,
            disabled: true,
        },
    ],
    [
        {
            label: t("rewards"),
            href: "/rewards",
            icon: CircleDollarSign,
            disabled: true,
        },
        {
            label: t("app"),
            href: "/app",
            icon: Smartphone,
            disabled: true,
        },
    ],
];
export default getSidebarItems;

