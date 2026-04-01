"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = {};

function Recommended({}: Props) {
  const t = useTranslations("FlightsTestPage.Recommended");

  const recommendedTabs = [
    {
      id: "destinations",
      label: t("tab_destinations"),
      links: [
        t("link_flightsBangkok"), t("link_flightsManila"), t("link_flightsShanghai"),
        t("link_flightsTokyo"), t("link_flightsSeoul"), t("link_flightsKL"),
        t("link_flightsPhnomPenh"), t("link_flightsHK"), t("link_flightsGuangzhou"),
        t("link_flightsSingapore"),
      ],
    },
    {
      id: "routes",
      label: t("tab_routes"),
      links: [
        t("link_cairRiyadh"), t("link_dubaiLondon"), t("link_jeddahCairo"),
        t("link_riyadhIstanbul"), t("link_abuDhabiBangkok"), t("link_dohaManila"),
        t("link_kuwaitAmman"), t("link_riyadhDubai"), t("link_dammamCairo"),
        t("link_muscatDelhi"),
      ],
    },
    {
      id: "airlines",
      label: t("tab_airlines"),
      links: [
        t("link_saudia"), t("link_qatarAirways"), t("link_emirates"),
        t("link_etihad"), t("link_turkish"), t("link_flynas"),
        t("link_flyadeal"), t("link_airArabia"), t("link_egyptair"),
        t("link_lufthansa"),
      ],
    },
    {
      id: "airports",
      label: t("tab_airports"),
      links: [
        t("link_kingKhalid"), t("link_kingAbdulaziz"), t("link_dubaiIntl"),
        t("link_hamad"), t("link_abuDhabiIntl"), t("link_cairoIntl"),
        t("link_istanbul"), t("link_heathrow"), t("link_suvarnabhumi"),
        t("link_changi"),
      ],
    },
    {
      id: "countries",
      label: t("tab_countries"),
      links: [
        t("link_flightsSaudi"), t("link_flightsUAE"), t("link_flightsEgypt"),
        t("link_flightsTurkey"), t("link_flightsThailand"), t("link_flightsPhilippines"),
        t("link_flightsIndia"), t("link_flightsMalaysia"), t("link_flightsUK"),
        t("link_flightsItaly"),
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(recommendedTabs[0].id);
  const activeData =
    recommendedTabs.find((tab) => tab.id === activeTab) ?? recommendedTabs[0];

  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight ">
        {t("title")}
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
