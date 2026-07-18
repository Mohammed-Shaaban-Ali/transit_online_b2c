"use client";

import { useEffect, useState } from "react";
import { IdCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import {
  LICENSE_BOOKING_FORM_DATA_KEY,
  LICENSE_BOOKING_ID_KEY,
  LICENSE_BOOKING_PRICE_DATA_KEY,
} from "@/constants";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";
import LicenseOutcomePanel from "./LicenseOutcomePanel";
import LicensePriceCard from "./LicensePriceCard";

interface StoredLicenseForm {
  name: string;
  email: string;
  address: string;
  phone: string;
  phoneCountryCode: string;
}

interface LicenseResultLayoutProps {
  outcome: "success" | "failed";
}

export default function LicenseResultLayout({
  outcome,
}: LicenseResultLayoutProps) {
  const t = useTranslations("LicenseBooking");
  const router = useRouter();

  const [formData, setFormData] = useState<StoredLicenseForm | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [priceData, setPriceData] = useState<
    LoyaltyCalculatePriceResponse["data"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedForm = sessionStorage.getItem(LICENSE_BOOKING_FORM_DATA_KEY);
      const storedId = sessionStorage.getItem(LICENSE_BOOKING_ID_KEY);
      const storedPrice = sessionStorage.getItem(LICENSE_BOOKING_PRICE_DATA_KEY);
      if (storedForm) {
        setFormData(JSON.parse(storedForm) as StoredLicenseForm);
      }
      if (storedId) setBookingId(storedId);
      if (storedPrice) {
        setPriceData(
          JSON.parse(storedPrice) as LoyaltyCalculatePriceResponse["data"],
        );
      }
    } catch (error) {
      console.error("License booking result: session read error", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto my-24 max-w-[1200px]!">
        <div className="space-y-4">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-gray-200" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-48 animate-pulse rounded-2xl bg-gray-200 lg:col-span-2" />
            <div className="h-64 animate-pulse rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!formData && !bookingId) {
    return (
      <div className="container mx-auto my-24 max-w-[1200px]!">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <IdCard className="h-10 w-10 text-gray-300" />
          </div>
          <h2 className="mb-2 text-24 font-bold">{t("noBookingData")}</h2>
          <p className="mx-auto mb-8 max-w-md text-gray-400">
            {t("noBookingDataDescription")}
          </p>
          <Button
            onClick={() => router.push("/licenses")}
            className="h-12 rounded-full px-8"
          >
            {t("backToForm")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto my-24 max-w-[1200px]!">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LicenseOutcomePanel
            outcome={outcome}
            bookingId={bookingId}
            formData={formData}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-12">
            <LicensePriceCard
              calculatedData={priceData ?? undefined}
              fallbackTotal={priceData?.total?.value ?? 0}
              fallbackCurrency={priceData?.currency ?? "SAR"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
