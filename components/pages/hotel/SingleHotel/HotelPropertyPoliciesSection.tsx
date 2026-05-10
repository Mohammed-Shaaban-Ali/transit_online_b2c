"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

function PolicyRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-33 border-b border-gray-100 pb-6 last:border-0 last:pb-0 md:grid-cols-[minmax(11rem,14rem)_1fr] md:items-start md:gap-10">
      <h3 className="text-base font-bold text-gray-900 md:pt-0.5">{label}</h3>
      <div className="min-w-0 text-base leading-relaxed text-gray-500">
        {children}
      </div>
    </div>
  );
}

export default function HotelPropertyPoliciesSection() {
  const t = useTranslations("HotelPropertyPolicies");

  return (
    <section className="mt-5 rounded-lg border border-gray-100 bg-white  shadow-sm  p-5">
      <h2 className="text-22 font-bold text-gray-900 ">{t("title")}</h2>

      <div className="mt-6 space-y-6">
        <PolicyRow label={t("checkInOut.label")}>
          <div className="space-y-1">
            <p>
              <span className="font-semibold text-gray-900">
                {t("checkInOut.checkInLabel")}
              </span>{" "}
              <span className="font-semibold text-gray-900">
                {t("checkInOut.checkInValue")}
              </span>
            </p>
            <p>
              <span className="font-semibold text-gray-900">
                {t("checkInOut.checkOutLabel")}
              </span>{" "}
              <span className="font-semibold text-gray-900">
                {t("checkInOut.checkOutValue")}
              </span>
            </p>
            <p>{t("checkInOut.frontDesk")}</p>
          </div>
        </PolicyRow>

        <PolicyRow label={t("guestsAccepted.label")}>
          <p>{t("guestsAccepted.body")}</p>
        </PolicyRow>

        <PolicyRow label={t("childPolicies.label")}>
          <div className="space-y-1">
            <p>{t("childPolicies.line1")}</p>
            <p>{t("childPolicies.line2")}</p>
          </div>
        </PolicyRow>

        <PolicyRow label={t("cribs.label")}>
          <p>{t("cribs.body")}</p>
        </PolicyRow>

        <PolicyRow label={t("breakfast.label")}>
          <p>{t("breakfast.body")}</p>
        </PolicyRow>

        <PolicyRow label={t("deposit.label")}>
          <p>
            <span className="font-semibold text-gray-900">
              {t("deposit.depositWord")}
            </span>{" "}
            {t("deposit.body")}
          </p>
        </PolicyRow>

        <PolicyRow label={t("pets.label")}>
          <p>{t("pets.body")}</p>
        </PolicyRow>

        <PolicyRow label={t("serviceAnimals.label")}>
          <p>{t("serviceAnimals.body")}</p>
        </PolicyRow>

        <PolicyRow label={t("ageRequirements.label")}>
          <p>{t("ageRequirements.body")}</p>
        </PolicyRow>
      </div>
    </section>
  );
}
