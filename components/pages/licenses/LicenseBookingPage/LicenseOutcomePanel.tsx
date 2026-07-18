"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

interface StoredLicenseForm {
  name: string;
  email: string;
  address: string;
  phone: string;
  phoneCountryCode: string;
}

interface LicenseOutcomePanelProps {
  outcome: "success" | "failed";
  bookingId: string | null;
  formData: StoredLicenseForm | null;
}

export default function LicenseOutcomePanel({
  outcome,
  bookingId,
  formData,
}: LicenseOutcomePanelProps) {
  const t = useTranslations("LicenseBooking");
  const router = useRouter();
  const isSuccess = outcome === "success";

  return (
    <div className="flex flex-col gap-6">
      <div
        className={`rounded-xl border p-6 ${
          isSuccess
            ? "border-emerald-200 bg-emerald-50/60"
            : "border-red-200 bg-red-50/60"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-start">
          {isSuccess ? (
            <CheckCircle2
              className="h-14 w-14 shrink-0 text-emerald-600"
              strokeWidth={1.75}
              aria-hidden
            />
          ) : (
            <XCircle
              className="h-14 w-14 shrink-0 text-red-600"
              strokeWidth={1.75}
              aria-hidden
            />
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <h1 className="text-24 font-bold text-slate-900">
              {isSuccess ? t("outcomeSuccessTitle") : t("outcomeFailedTitle")}
            </h1>
            <p className="text-15 leading-relaxed text-slate-700">
              {isSuccess
                ? t("outcomeSuccessDescription")
                : t("outcomeFailedDescription")}
            </p>
            {isSuccess && bookingId ? (
              <p className="text-14 font-semibold text-slate-800">
                <span className="text-slate-600">
                  {t("bookingReference")}:{" "}
                </span>
                {bookingId}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      {formData ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-18 font-bold text-slate-900">
            {t("contactSummary")}
          </h2>
          <div className="mt-4 space-y-3 rounded-lg border border-gray-100 bg-gray-50/80 p-4 text-14">
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-6">
              <span className="font-semibold text-slate-700">{t("fullName")}</span>
              <span className="text-slate-900">{formData.name}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-6">
              <span className="font-semibold text-slate-700">{t("email")}</span>
              <span className="text-slate-900">{formData.email}</span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-6">
              <span className="font-semibold text-slate-700">{t("phone")}</span>
              <span className="text-slate-900 [direction:ltr]">
                {formData.phoneCountryCode} {formData.phone}
              </span>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:gap-x-6">
              <span className="font-semibold text-slate-700">
                {t("nationalAddress")}
              </span>
              <span className="text-slate-900">{formData.address}</span>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {isSuccess ? (
          <Button
            onClick={() => router.push("/")}
            className="h-11 rounded-full px-6"
          >
            {t("backToHome")}
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/licenses")}
            className="h-11 rounded-full px-6"
          >
            {t("outcomeTryAgain")}
          </Button>
        )}
      </div>
    </div>
  );
}
