"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = Record<string, never>;

function HotelsInfo({}: Props) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("HotelsTestPage.HotelsInfo");

  const destinations = [
    {
      region: t("regionAsia"),
      links: [t("link_tokyo"), t("link_bangkok"), t("link_indianapolis")],
    },
    {
      region: t("regionChina"),
      links: [t("link_beijing"), t("link_shanghai"), t("link_guangzhou")],
    },
    {
      region: t("regionEurope"),
      links: [t("link_london"), t("link_paris"), t("link_istanbul")],
    },
    {
      region: t("regionAmericas"),
      links: [t("link_lasvegas"), t("link_miami"), t("link_chicago")],
    },
    {
      region: t("regionOceania"),
      links: [t("link_melbourne"), t("link_goldcoast"), t("link_sydney")],
    },
  ];

  const whyBook = [
    <p key="wb1">{t("whyBook1")}</p>,
    <p key="wb2">{t("whyBook2")}</p>,
    <p key="wb3">
      {t("whyBook3Pre")}{" "}
      <a href="#" className="text-primary underline">
        {t("whyBook3Label")}
      </a>{" "}
      {t("whyBook3Post")}
    </p>,
    <p key="wb4">
      {t("whyBook4Pre")}{" "}
      <a href="#" className="text-primary underline">
        {t("whyBook4RefundsLabel")}
      </a>{" "}
      {t("whyBook4Mid")}{" "}
      <a href="#" className="text-primary underline">
        {t("whyBook4SupportLabel")}
      </a>{" "}
      {t("whyBook4Post")}
    </p>,
  ];

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! py-6">
      <h2 className="mb-4 text-[22px] font-bold leading-tight sm:text-[28px]">
        {t("title")}
      </h2>

      <div className="rounded-xl border border-gray-200 bg-white px-4 py-4 sm:px-6 sm:py-5">
        {/* Always visible */}
        <h3 className="mb-2 text-[16px] font-semibold">{t("perfectStayTitle")}</h3>
        <p className="text-[14px] leading-relaxed text-black/70">
          {t("perfectStayText")}
        </p>

        <div className="mt-4 text-[14px] leading-relaxed text-black/70">
          <p className="mb-1 font-semibold text-black/70">
            {t("trendingDestinationsLabel")}
          </p>
          {destinations.map((dest) => (
            <p key={dest.region}>
              <span className="text-black/70">{dest.region}: </span>
              {dest.links.map((link, i) => (
                <span key={link}>
                  <a href="#" className="text-primary underline">
                    {link}
                  </a>
                  {i < dest.links.length - 1 && (
                    <span className="text-black/70">, </span>
                  )}
                </span>
              ))}
            </p>
          ))}
        </div>

        {/* Expandable section */}
        {expanded && (
          <div className="mt-4 text-[14px] leading-relaxed text-black/70">
            <h3 className="mb-2 text-[16px] font-semibold">
              {t("whyBookTitle")}
            </h3>
            {whyBook}
          </div>
        )}

        {/* Show More / Show Less */}
        <div className="mt-4 pt-3 text-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[14px] font-medium text-primary hover:text-primary/80"
          >
            {expanded ? (
              <>
                {t("showLess")} <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                {t("showMore")} <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}

export default HotelsInfo;
