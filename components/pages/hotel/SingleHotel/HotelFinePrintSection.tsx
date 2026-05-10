"use client";

import { useTranslations } from "next-intl";

export default function HotelFinePrintSection() {
  const t = useTranslations("HotelFinePrint");

  return (
    <section className="mt-5 rounded-lg border border-gray-100 bg-white  shadow-sm  p-5">
      <h2 className="text-22 font-bold text-gray-900 ">{t("title")}</h2>

      <div className="mt-6 grid gap-3 md:grid-cols-[minmax(11rem,14rem)_1fr] md:items-start md:gap-10">
        <h3 className="text-base font-bold text-gray-900 md:pt-0.5">
          {t("cityNotes")}
        </h3>
        <p className="min-w-0 text-base leading-relaxed text-gray-500">
          {t("cityNotesBody")}
        </p>
      </div>
    </section>
  );
}
