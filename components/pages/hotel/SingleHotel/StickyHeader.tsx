"use client";

import { formatePrice } from "@/utils/formatePrice";
import { CURRENCY_CONFIG } from "@/config/currency";
import { useEffect, useState } from "react";

export default function StickyHeader({ hotel }: { hotel?: any }) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!hotel) return null;

  return (
    <div
      className={`${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
          : "relative"
      } transition-all duration-300`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex-1">
            <div className="">
              <h1 className="text-40 font-bold">{hotel?.displayName}</h1>
              <h5 className="text-16 font-bold">{hotel?.displayNameAr}</h5>
            </div>
            <p className="text-sm text-gray-600">{hotel?.address}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {CURRENCY_CONFIG.currencySymbolEn} {formatePrice(hotel?.price || 0)}
              </div>
              <div className="text-xs text-gray-500">per night</div>
            </div>
            <a
              href="#rooms"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
