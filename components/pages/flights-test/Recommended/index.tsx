"use client";

import { useState } from "react";

type Props = {};

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

function Recommended({}: Props) {
  const [activeTab, setActiveTab] = useState(recommendedTabs[0].id);
  const activeData =
    recommendedTabs.find((tab) => tab.id === activeTab) ?? recommendedTabs[0];

  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight ">
        Recommended by Trip.com
      </h2>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-3.5">
          {recommendedTabs.map((tab) => {
            const isActive = tab.id === activeTab;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-sm px-4 py-2 text-[14px] transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#101f3d] text-white shadow-[0px_8px_16px_0px_rgba(15,41,77,0.08)]"
                    : "bg-[#e1ecfc3f] text-black hover:text-primary"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-md bg-white p-5 shadow-[0px_8px_16px_0px_rgba(15,41,77,0.08)]">
          <div className="grid grid-cols-1 gap-y-5 text-[14px]  sm:grid-cols-2 lg:grid-cols-5">
            {activeData.links.map((link) => (
              <button
                key={link}
                type="button"
                className="w-fit text-start hover:text-primary  hover:underline cursor-pointer"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Recommended;
