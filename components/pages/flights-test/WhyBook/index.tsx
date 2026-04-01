"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type Props = {};

function WhyBook({}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("FlightsTestPage.WhyBook");

  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight ">
        {t("title")}
      </h2>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="text-[18px] font-bold leading-tight ">
          {t("flightsToSuitYouTitle")}
        </h3>
        <p className="mt-2 text-[14px] text-black/60">
          {isExpanded ? t("flightsToSuitYouTextExpanded") : t("flightsToSuitYouText")}
        </p>

        {isExpanded && (
          <>
            <h3 className="mt-6 text-[18px] font-bold leading-tight ">
              {t("bookCheapTitle")}
            </h3>
            <p className="mt-2 text-[14px] text-black/60">
              {t("bookCheapText")}
            </p>
          </>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-[14px] text-primary hover:underline cursor-pointer"
          >
            {isExpanded ? t("showLess") : t("showMore")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default WhyBook;
