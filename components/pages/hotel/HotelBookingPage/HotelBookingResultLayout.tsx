"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { FaHotel } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  HOTEL_BOOKING_KEY,
  HOTEL_BOOKING_ID_KEY,
  HOTEL_BOOKING_FORM_DATA_KEY,
} from "@/constants";
import type { BookingFormValues } from "@/components/shared/booking/HotelBookingForm";
import HotelDetailsCard from "./HotelDetailsCard";
import DatesCard from "./DatesCard";
import PriceDetailsCard from "./PriceDetailsCard";
import CancellationPolicyCard from "./CancellationPolicyCard";
import RewardsCard from "./RewardsCard";
import FinePrintCard from "./FinePrintCard";
import HotelBookingOutcomePanel from "./HotelBookingOutcomePanel";
import { useLazyCalculateHotelPriceQuery } from "@/redux/features/hotels/hotelsApi";
import type { IPackage } from "@/types/hotels";

export interface HotelBookingResultHotelData {
  hotelId: string;
  uuid: string;
  hotelName: string;
  starRating: number;
  hotelImage?: string;
  package: IPackage;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
}

interface HotelBookingResultLayoutProps {
  outcome: "success" | "failed";
}

export default function HotelBookingResultLayout({
  outcome,
}: HotelBookingResultLayoutProps) {
  const t = useTranslations("HotelBooking");
  const router = useRouter();

  const [hotelData, setHotelData] =
    useState<HotelBookingResultHotelData | null>(null);
  const [formData, setFormData] = useState<BookingFormValues | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [calculatePrice, calculatePriceState] =
    useLazyCalculateHotelPriceQuery();

  useEffect(() => {
    try {
      const storedHotel = sessionStorage.getItem(HOTEL_BOOKING_KEY);
      const storedForm = sessionStorage.getItem(HOTEL_BOOKING_FORM_DATA_KEY);
      const storedId = sessionStorage.getItem(HOTEL_BOOKING_ID_KEY);
      if (storedHotel) {
        setHotelData(JSON.parse(storedHotel) as HotelBookingResultHotelData);
      }
      if (storedForm) {
        setFormData(JSON.parse(storedForm) as BookingFormValues);
      }
      if (storedId) setBookingId(storedId);
    } catch (e) {
      console.error("Hotel booking result: session read error", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hotelData) return;
    const originalPrice = Number(hotelData.package?.price?.finalPrice || 0);
    if (!originalPrice) return;
    calculatePrice({ originalPrice, module: "hotels", points: false }).catch(
      (err) => console.error("Hotel price calculation error:", err),
    );
  }, [hotelData, calculatePrice]);

  if (isLoading) {
    return (
      <div className="container my-24 max-w-[1200px]! mx-auto">
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

  if (!hotelData) {
    return (
      <div className="container my-24 max-w-[1200px]! mx-auto">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <FaHotel className="text-4xl text-gray-300" />
          </div>
          <h2 className="text-24 mb-2 font-bold">{t("noHotelData")}</h2>
          <p className="mx-auto mb-8 max-w-md text-gray-400">
            {t("noHotelDataDescription")}
          </p>
          <Button
            onClick={() => router.push("/hotels")}
            className="h-12 rounded-full px-8"
          >
            {t("backToSearch")}
          </Button>
        </div>
      </div>
    );
  }

  const pkg = hotelData.package;
  const firstRoom = pkg?.rooms?.[0];
  const finalPrice = Number(pkg?.price?.finalPrice || 0);
  const roomsCount = pkg?.rooms?.length || 1;
  const adultsCount = firstRoom?.adultsCount || hotelData.adults || 1;
  const grandTotal = finalPrice;
  const cancellationFee = grandTotal * 0.25;
  const totalRewardsBase =
    calculatePriceState.data?.data?.total?.value ?? grandTotal;

  return (
    <div className="container my-24 max-w-[1200px]! mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <HotelBookingOutcomePanel
            outcome={outcome}
            bookingId={bookingId}
            formData={formData}
            hotelId={hotelData.hotelId}
            uuid={hotelData.uuid}
          />
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-12">
            <HotelDetailsCard
              hotelName={hotelData.hotelName}
              hotelImage={hotelData.hotelImage}
              starRating={hotelData.starRating}
              firstRoom={firstRoom}
              adultsCount={adultsCount}
              refundability={pkg?.refundability}
              refundableText={pkg?.refundableText}
            />

            <DatesCard
              checkIn={hotelData.checkIn}
              checkOut={hotelData.checkOut}
              nights={hotelData.nights}
              roomsCount={roomsCount}
            />

            <PriceDetailsCard
              roomsCount={roomsCount}
              nights={hotelData.nights}
              calculatedData={calculatePriceState.data?.data}
              isCalculating={calculatePriceState.isFetching}
              fallbackTotal={grandTotal}
            />

            <CancellationPolicyCard
              checkIn={hotelData.checkIn}
              cancellationFee={cancellationFee}
            />

            {/* <RewardsCard grandTotal={totalRewardsBase} /> */}

            {/* <FinePrintCard /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
