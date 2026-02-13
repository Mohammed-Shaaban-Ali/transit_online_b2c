"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { FaHotel } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { HOTEL_BOOKING_KEY } from "@/constants";
import BookingConfirmation from "@/components/shared/booking/BookingConfirmation";
import type { BookingFormValues } from "@/components/shared/booking/HotelBookingForm";

const HOTEL_BOOKING_ID_KEY = "HOTEL_BOOKING_ID";
const HOTEL_FORM_DATA_KEY = "HOTEL_BOOKING_FORM_DATA";

interface HotelBookingData {
  hotelId: string;
  uuid: string;
  hotelName: string;
  starRating: number;
  hotelImage?: string;
  package: any;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
}

const HotelBookingSuccessPage = () => {
  const t = useTranslations("HotelBooking");
  const router = useRouter();

  const [hotelData, setHotelData] = useState<HotelBookingData | null>(null);
  const [bookingId, setBookingId] = useState("");
  const [formData, setFormData] = useState<BookingFormValues | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHotel = sessionStorage.getItem(HOTEL_BOOKING_KEY);
      const storedBookingId = sessionStorage.getItem(HOTEL_BOOKING_ID_KEY);
      const storedFormData = sessionStorage.getItem(HOTEL_FORM_DATA_KEY);

      if (storedHotel) setHotelData(JSON.parse(storedHotel));
      if (storedBookingId) setBookingId(storedBookingId);
      if (storedFormData) setFormData(JSON.parse(storedFormData));
    } catch (error) {
      console.error("Error reading hotel booking success data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container my-24">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!hotelData || !formData || !bookingId) {
    return (
      <div className="container my-24">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <FaHotel className="text-gray-300 text-4xl" />
          </div>
          <h2 className="text-24 font-bold mb-2">{t("noHotelData")}</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {t("noHotelDataDescription")}
          </p>
          <Button
            onClick={() => router.push("/hotels")}
            className="rounded-full h-12 px-8"
          >
            {t("backToSearch")}
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice =
    Number(hotelData.package?.price?.finalPrice || 0) * hotelData.nights;

  return (
    <BookingConfirmation
      bookingId={bookingId}
      hotelName={hotelData.hotelName}
      hotelImage={hotelData.hotelImage}
      starRating={hotelData.starRating}
      checkIn={hotelData.checkIn}
      checkOut={hotelData.checkOut}
      nights={hotelData.nights}
      adults={hotelData.adults}
      childrenCount={hotelData.children}
      totalPrice={totalPrice}
      formData={formData}
      rooms={hotelData.package?.rooms || []}
    />
  );
};

export default HotelBookingSuccessPage;
