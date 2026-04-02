"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = Record<string, never>;

function Recommendations({}: Props) {
  const t = useTranslations("HotelsTestPage.Recommendations");

  const tabs = [
    { key: "topDestinations", label: t("tab_topDestinations") },
    { key: "nearAttractions", label: t("tab_nearAttractions") },
    { key: "exploreMore", label: t("tab_exploreMore") },
    { key: "latestTrends", label: t("tab_latestTrends") },
    { key: "luxuryHotels", label: t("tab_luxuryHotels") },
    { key: "moreTypes", label: t("tab_moreTypes") },
  ];

  const tabContent: Record<string, string[]> = {
    topDestinations: [
      t("link_shanghai"), t("link_guangzhou"), t("link_bangkok"),
      t("link_beijing"), t("link_shenzhen"), t("link_hongkong"),
      t("link_tokyo"), t("link_chongqing"), t("link_hochiminh"), t("link_seoul"),
    ],
    nearAttractions: [
      t("link_eiffel"), t("link_timessquare"), t("link_bigben"),
      t("link_colosseum"), t("link_burjkhalifa"), t("link_operahouse"),
      t("link_sagrada"), t("link_louvre"), t("link_tajmahal"), t("link_libertystature"),
    ],
    exploreMore: [
      t("link_beachfront"), t("link_mountain"), t("link_citycenter"),
      t("link_airport"), t("link_boutique"), t("link_allinclusive"),
      t("link_petfriendly"), t("link_family"), t("link_romantic"), t("link_budget"),
    ],
    latestTrends: [
      t("link_trendingasia"), t("link_trendingeurope"), t("link_trendingamericas"),
      t("link_trendingme"), t("link_trendingoceania"), t("link_weekend"),
      t("link_summer"), t("link_winter"), t("link_hiddengems"), t("link_newopenings"),
    ],
    luxuryHotels: [
      t("link_paris5star"), t("link_dubai5star"), t("link_tokyo5star"),
      t("link_ny5star"), t("link_london5star"), t("link_singapore5star"),
      t("link_bangkok5star"), t("link_sydney5star"), t("link_maldives5star"), t("link_rome5star"),
    ],
    moreTypes: [
      t("link_hostels"), t("link_apartments"), t("link_villas"),
      t("link_guesthouses"), t("link_bnbs"), t("link_motels"),
      t("link_resorts"), t("link_ryokans"), t("link_lodges"), t("link_capsule"),
    ],
  };

  const [activeTab, setActiveTab] = useState(tabs[0].key);

  const links = tabContent[activeTab] ?? [];
  const half = Math.ceil(links.length / 2);
  const row1 = links.slice(0, half);
  const row2 = links.slice(half);

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! py-6 md:py-8">
      <h2 className="mb-4 text-[22px] font-bold leading-tight sm:text-[28px]">
        {t("title")}
      </h2>

      {/* Tabs — horizontally scrollable on mobile */}
      <div className="flex overflow-x-auto border-b border-gray-300 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`relative shrink-0 whitespace-nowrap px-3 py-2.5 text-[14px] font-semibold transition-colors sm:px-4 sm:text-[16px] ${
              activeTab === tab.key ? "border-b-2 border-primary" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Links grid */}
      <div className="mt-4 rounded-xl border border-gray-300 p-3 sm:mt-5 sm:p-4">
        <div className="grid grid-cols-2 gap-x-3 gap-y-0 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-5">
          {row1.map((link) => (
            <a
              key={link}
              href="#"
              className="py-2.5 text-[14px] text-black/70 hover:text-primary last:border-0"
            >
              {link}
            </a>
          ))}
          {row2.map((link) => (
            <a
              key={link}
              href="#"
              className="py-2.5 text-[14px] text-black/70 hover:text-primary last:border-0"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Recommendations;
