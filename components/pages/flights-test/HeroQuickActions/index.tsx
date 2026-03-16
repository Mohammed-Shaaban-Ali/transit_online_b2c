"use client";

import {
  IoAirplane,
  IoBarChart,
  IoCalendar,
  IoNotifications,
} from "react-icons/io5";
import { RiFlightTakeoffLine } from "react-icons/ri";

type Props = {};

const heroActions = [
  {
    id: "bookings",
    label: "My bookings",
    icon: <IoCalendar className="size-7 text-[#173a73]" />,
  },
  {
    id: "price-alerts",
    label: "Price alerts",
    icon: <IoNotifications className="size-7 text-[#173a73]" />,
  },
  {
    id: "status",
    label: "Flight status",
    icon: <IoBarChart className="size-7 text-[#173a73]" />,
  },
  {
    id: "private-jet",
    label: "Private jet charters",
    icon: <RiFlightTakeoffLine className="size-7 text-[#173a73]" />,
  },
];

function HeroQuickActions({}: Props) {
  return (
    <div className="absolute right-10 bottom-28 z-20 hidden md:flex md:flex-col md:gap-2.5">
      {heroActions.map((action) => (
        <div key={action.id} className="group flex items-center justify-end">
          <button
            type="button"
            className="relative ml-auto h-13 w-13 cursor-pointer overflow-hidden rounded-md
             bg-white text-[#173a73]  transition-[width]
              duration-500 ease-out group-hover:w-full
              flex items-center justify-center
              "
            aria-label={action.label}
          >
            <span className="flex h-full w-full items-center pl-4 pr-13 ">
              <span className="max-w-0 overflow-hidden whitespace-nowrap text-[16px] font-medium text-[#111827] opacity-0 -translate-x-3 transition-all duration-300 ease-out group-hover:max-w-[190px] group-hover:translate-x-0 group-hover:opacity-100">
                {action.label}
              </span>
            </span>

            <span className="absolute right-0 top-0 flex h-13 w-13 items-center justify-center">
              {action.icon}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}

export default HeroQuickActions;
