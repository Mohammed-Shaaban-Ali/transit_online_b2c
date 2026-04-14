"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const recommendedTabs = [
  {
    id: "destinations",
    label: "Flights to Popular Destinations",
    links: [
      "Flights to Bangkok",
      "Flights to Manila",
      "Flights to Shanghai",
      "Flights to Tokyo",
      "Flights to Seoul",
      "Flights to Kuala Lumpur",
      "Flights to Phnom Penh",
      "Flights to Hong Kong",
      "Flights to Guangzhou",
      "Flights to Singapore",
    ],
  },
  {
    id: "routes",
    label: "Popular Flights Routes",
    links: [
      "Cairo to Riyadh",
      "Dubai to London",
      "Jeddah to Cairo",
      "Riyadh to Istanbul",
      "Abu Dhabi to Bangkok",
      "Doha to Manila",
      "Kuwait to Amman",
      "Riyadh to Dubai",
      "Dammam to Cairo",
      "Muscat to Delhi",
    ],
  },
  {
    id: "airlines",
    label: "Popular Airlines",
    links: [
      "Saudia",
      "Qatar Airways",
      "Emirates",
      "Etihad Airways",
      "Turkish Airlines",
      "Flynas",
      "Flyadeal",
      "Air Arabia",
      "EgyptAir",
      "Lufthansa",
    ],
  },
  {
    id: "airports",
    label: "Popular Airports",
    links: [
      "King Khalid International",
      "King Abdulaziz International",
      "Dubai International",
      "Hamad International",
      "Abu Dhabi International",
      "Cairo International",
      "Istanbul Airport",
      "Heathrow Airport",
      "Suvarnabhumi Airport",
      "Singapore Changi",
    ],
  },
  {
    id: "countries",
    label: "Cheap Flights to Popular Countries",
    links: [
      "Flights to Saudi Arabia",
      "Flights to UAE",
      "Flights to Egypt",
      "Flights to Turkey",
      "Flights to Thailand",
      "Flights to Philippines",
      "Flights to India",
      "Flights to Malaysia",
      "Flights to UK",
      "Flights to Italy",
    ],
  },
];

export default function Recommended() {
  const [activeTab, setActiveTab] = useState(recommendedTabs[0].id);
  const activeData =
    recommendedTabs.find((tab) => tab.id === activeTab) ?? recommendedTabs[0];

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-[22px] font-bold leading-tight text-[#111827]">
        Trip.com recommendations
      </h2>

      <Swiper
        slidesPerView="auto"
        spaceBetween={10}
        className="overflow-visible!"
      >
        {recommendedTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <SwiperSlide key={tab.id} className="w-auto!">
              <button
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap rounded-md px-4 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#101f3d] text-white"
                    : "bg-[#EEF2FA] text-[#1F2937]"
                }`}
              >
                {tab.label}
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="mt-3 rounded-xl bg-white p-4 shadow-[0px_8px_16px_0px_rgba(15,41,77,0.08)]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5">
          {activeData.links.map((link) => (
            <button
              key={link}
              type="button"
              className="w-fit text-left text-[14px] font-medium text-[#1F2937] hover:text-primary"
            >
              {link}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
