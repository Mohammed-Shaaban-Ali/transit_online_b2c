import React, { useState } from "react";
import heroSection from "@/public/images/new_hone/heroSection.webp";
import Image from "next/image";
import {
  BedDouble,
  Building2,
  Car,
  Landmark,
  Plane,
  Search,
  Train,
  ChevronDown,
} from "lucide-react";
import Form from "@/components/pages/flights-test/FlightsTestHero/Form";
import HotelsTestHotelSearchForm from "@/components/pages/hotels-test/HotelsTestHero/Form/HotelsTestHotelSearchForm";

type Props = {};

const titles = [
  {
    title: "Secure payment",
    link: "https://ak-d.tripcdn.com/images/0AS6b1200090fx7s7F635.png",
  },
  {
    title: "Support in approx. 30s",
    link: "https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png",
  },
];

const tabs = [
  { title: "Hotels & Homes", icon: BedDouble },
  { title: "Flights", icon: Plane },
  { title: "Trains", icon: Train },
  { title: "Cars", icon: Car },
  { title: "Attractions & Tours", icon: Landmark },
  { title: "Flight + Hotel", icon: Building2 },
];

function Hero({}: Props) {
  const [activeTab, setActiveTab] = useState("Flights");

  return (
    <section
      className={`relative w-full
    
    ${activeTab === "Hotels & Homes" ? "h-[310px]" : "h-[380px]"}`}
    >
      <Image
        src={heroSection}
        alt="heroSection"
        width={1000}
        height={1000}
        className="h-full w-full overflow-hidden rounded-2xl object-cover object-right"
      />

      <div className="absolute left-1/2 top-1/2 w-full max-w-[1200px] -translate-x-1/2 -translate-y-1/2 px-4">
        <div>
          <h1 className="text-center text-4xl font-bold text-white md:text-5xl mt-12">
            Your Trip Starts Here
          </h1>
          <div className="mt-3 flex items-center justify-center gap-2">
            {titles.map((title, index) => (
              <div key={title.title} className="flex items-center gap-1">
                <Image
                  src={title.link}
                  alt={title.title}
                  width={100}
                  height={100}
                  className="size-5"
                />
                <p className="text-sm font-bold text-white/90">{title.title}</p>
                <span
                  className={`ms-2 h-4 w-0.5 rounded-full bg-white/60
                  ${index === titles.length - 1 ? "hidden" : ""}
                  `}
                ></span>
              </div>
            ))}
          </div>

          <div className="relative mx-auto translate-y-12">
            <div className="relative z-20 mx-auto -mb-8 flex w-fit flex-wrap items-center justify-center gap-1.5 rounded-full bg-[#0f2146] p-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.title}
                    type="button"
                    onClick={() => setActiveTab(tab.title)}
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-white transition
                      ${
                        tab.title === activeTab
                          ? "bg-white text-black!"
                          : "hover:bg-white/20"
                      }`}
                  >
                    <Icon className="size-4" />
                    {tab.title}
                  </button>
                );
              })}
            </div>

            <div
              className="relative z-10 mt-2 min-h-32 rounded-2xl bg-white p-2 shadow-sm
  
            "
            >
              {activeTab === "Hotels & Homes" ? (
                <HotelsTestHotelSearchForm className="mt-10" />
              ) : (
                <Form />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
