import type { LucideIcon } from "lucide-react";
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

const sidebarItems: SidebarItem[][] = [
    [
        {
            label: "Hotels & Homes",
            href: "/new/hotels",
            icon: BedDouble,
        },
        {
            label: "Flights",
            href: "/new/flights",
            icon: Plane,
        },
        {
            label: "Trains",
            href: "/new/trains",
            icon: TrainFront,
        },
        {
            label: "Cars",
            href: "/new/cars",
            icon: CarFront,
        },
        {
            label: "Attractions & Tours",
            href: "/new/attractions",
            icon: FerrisWheel,
        },
        {
            label: "Flight + Hotel",
            href: "/new/flight-hotel",
            icon: Hotel,
        },
    ],
    [
        {
            label: "Private Tours",
            href: "/new/private-tours",
            icon: Luggage,
        },
        {
            label: "Group Tours",
            href: "/new/group-tours",
            icon: Flag,
        },
    ],
    [
        {
            label: "Trip.Planner",
            href: "/new/planner",
            icon: Route,
            isNew: true,
        },
        {
            label: "Travel Inspiration",
            href: "/new/inspiration",
            icon: Lightbulb,
        },
        {
            label: "Map",
            href: "/new/map",
            icon: MapPinned,
        },
        {
            label: "Deals",
            href: "/new/deals",
            icon: BadgePercent,
        },
    ],
    [
        {
            label: "Trip.com Rewards",
            href: "/new/rewards",
            icon: CircleDollarSign,
        },
        {
            label: "App",
            href: "/new/app",
            icon: Smartphone,
        },
    ],
];

export default sidebarItems;
