"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { MdFilterList } from "react-icons/md";
import Sidebar from "./index";

interface MobileSidebarProps {
  availableAirlines?: { id?: string; count?: string; text?: string }[];
  stops?: { id: number; text: string; count: number }[];
  priceRange?: { min: number; max: number };
  flightCount?: number;
  providers?: { id: string; text: string; count: number; logo: string }[];
  sortingOptions?: { id: "price" | "duration"; text: string }[];
  flightType?: "departure" | "return";
  fromCity?: string;
  toCity?: string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = (props) => {
  const t = useTranslations("FlightMobileSidebar");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg mb-4 hover:bg-primary-dark transition-colors"
      >
        <MdFilterList size={20} />
        <span>{t("filterFlights")}</span>
      </button>

      {/* Offcanvas Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto xl:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">{t("filterFlights")}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Sidebar Content */}
          <Sidebar {...props} />
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
