"use client";
import { useState } from "react";
import { RiFlightTakeoffFill, RiHotelBedFill } from "react-icons/ri";
import Image from "next/image";
import { BsCreditCard2FrontFill } from "react-icons/bs";
import heroImage from "@/public/images/homeherro.jpg";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
// import HotelSearchBox from "@/components/shared/HotelSearchBox";
// import FlightSearchBox from "@/components/shared/FlightSearchBox";

import dynamic from "next/dynamic";
const HotelSearchBox = dynamic(
  () => import("@/components/shared/HotelSearchBox"),
  {
    ssr: false,
    loading: () => (
      <div className="sm:h-[110px] h-[400px] w-full bg-primary-light animate-pulse rounded-b-xl ltr:rounded-tr-2xl rtl:rounded-tl-2xl" />
    ),
  }
);
const FlightSearchBox = dynamic(
  () => import("@/components/shared/FlightSearchBox"),
  {
    ssr: false,
    loading: () => (
      <div className="sm:h-[110px] h-[400px] w-full bg-primary-light animate-pulse rounded-b-xl ltr:rounded-tr-2xl rtl:rounded-tl-2xl" />
    ),
  }
);
export const HomeHero = () => {
  const t = useTranslations("Home.Hero");
  const tabs = [
    {
      id: 1,
      name: "Hotel",
      label: t("hotel"),
      Icon: <RiHotelBedFill className="size-4! sm:size-6!  " />,
    },
    {
      id: 2,
      name: "Flight",
      label: t("flight"),
      Icon: <RiFlightTakeoffFill className="size-4! sm:size-6!  " />,
    },
  ];
  const [currentTab, setCurrentTab] = useState("Hotel");

  return (
    <section className="relative min-h-screen ">
      <Image
        src={heroImage}
        alt={t("imageAlt")}
        fill
        className="object-cover"
      />
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/30"></div>
      <div
        className="container w-full!  
       z-10 absolute bottom-12 sm:bottom-20 left-1/2 -translate-x-1/2  "
      >
        <div className="flex flex-col items-center justify-between h-full gap-10 sm:gap-20 w-full min-h-[55vh]">
          <div className="text-center">
            <h1 className="text-60 font-bold text-white leading-tight">
              {t("title")}
            </h1>
          </div>

          <div className="w-full">
            <div
              className="flex gap-2 justify-start 
             bg-primary-light backdrop-blur-sm p-2 sm:p-3.5 py-3 sm:py-5 rounded-t-2xl w-fit
              overflow-hidden"
            >
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  type="button"
                  className={`
                      h-10! sm:h-11! px-4! sm:px-6! flex items-center justify-center gap-2 font-bold
                       sm:text-lg  rounded-full transition-all duration-300
                      ${tab?.name === currentTab
                      ? "bg-primary! text-white "
                      : " text-black hover:bg-primary/20! bg-transparent"
                    }`}
                  onClick={() => setCurrentTab(tab?.name)}
                >
                  {tab?.Icon}
                  {tab?.label}
                </Button>
              ))}
            </div>
            {currentTab === "Hotel" && <HotelSearchBox />}
            {currentTab === "Flight" && <FlightSearchBox />}
          </div>
        </div>
      </div>
    </section>
  );
};
