"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const FAQ_KEYS = [
  "driveInsideSaudi",
  "validityPeriod",
  "withoutSaudiLicense",
  "validityOutside",
  "processingTime",
  "permittedCountries",
  "vehicleCategories",
  "citizensAndResidents",
] as const;

export default function LicenseFaq() {
  const t = useTranslations("LicenseBooking.faq");
  const [openKey, setOpenKey] = useState<string | null>("driveInsideSaudi");

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
      <h2 className="mb-4 text-18 font-bold text-slate-900">{t("title")}</h2>
      <div className="space-y-2">
        {FAQ_KEYS.map((key) => {
          const isOpen = openKey === key;
          return (
            <div
              key={key}
              className="overflow-hidden rounded-lg border border-amber-100/80 bg-[#FDF8F0]"
            >
              <button
                type="button"
                onClick={() => setOpenKey(isOpen ? null : key)}
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-start"
              >
                <span className="text-14 font-medium text-slate-800">
                  {t(`items.${key}.question`)}
                </span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-amber-700 transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen ? (
                <div className="border-t border-amber-100/80 px-4 py-3 text-13 leading-relaxed text-amber-800">
                  {t(`items.${key}.answer`)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
