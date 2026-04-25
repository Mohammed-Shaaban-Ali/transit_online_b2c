"use client";

import { ChevronRight, Circle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckedBaggageProtection() {
  const t = useTranslations("FlightBookingPageNested.checkedBaggageProtection");

  return (
    <section className="mt-2">
      <h3 className="mb-3 text-24 font-bold leading-none ">{t("title")}</h3>

      <div className="rounded-2xl border border-gray-100 bg-white p-5">
        <h4 className="mb-3 text-[16px] font-semibold leading-none text-slate-900">
          {t("title")}
        </h4>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div className="max-w-[860px] text-[14px] leading-relaxed text-gray-600">
            <span className="mr-2 text-primary">✓</span>
            {t("descriptionPrefix")}{" "}
            <span className="font-semibold text-primary">
              {t("compensationAmount")}
            </span>{" "}
            <button
              type="button"
              className="inline-flex items-center gap-1 font-medium text-primary"
            >
              {t("viewMore")}
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex items-center gap-3 self-end md:self-start">
            <p className="text-[14px] text-slate-700">
              <span className="font-semibold text-primary">
                {t("priceAmount")}
              </span>
              {t("priceSuffix")}
            </p>
            <button type="button" aria-label={t("selectAriaLabel")}>
              <Circle size={20} className="text-primary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
