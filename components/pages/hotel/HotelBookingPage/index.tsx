"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import {
  FaCalendar,
  FaClock,
  FaHotel,
  FaUser,
  FaUtensils,
} from "react-icons/fa";
import { IoMdBed } from "react-icons/io";
import { MdMeetingRoom } from "react-icons/md";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import StarRating from "@/components/shared/StarRating";
import PackageImages from "@/components/shared/PackageImages";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";
import { HOTEL_BOOKING_KEY } from "@/constants";

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

const HotelBookingPage = () => {
  const t = useTranslations("HotelBooking");
  const tHotelsCard = useTranslations("HotelsCard");
  const router = useRouter();
  const [hotelData, setHotelData] = useState<HotelBookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(HOTEL_BOOKING_KEY);
      if (stored) {
        setHotelData(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error reading hotel booking data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="container my-24">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-72 bg-gray-200 rounded-2xl animate-pulse" />
              <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!hotelData) {
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

  const item = hotelData;
  const pkg = item.package;
  const packageImages =
    pkg.images && pkg.images.length > 0
      ? pkg.images
      : pkg.rooms?.[0]?.images || [];

  const totalPrice = Number(pkg?.price?.finalPrice || 0) * item.nights;

  const infoBadges = [
    {
      key: "dates",
      icon: <FaCalendar size={13} />,
      label: `${item.checkIn} - ${item.checkOut}`,
    },
    {
      key: "nights",
      icon: <FaClock size={13} />,
      label: `${item.nights} ${item.nights === 1 ? tHotelsCard("night") : tHotelsCard("nights")}`,
    },
    {
      key: "guests",
      icon: <FaUser size={13} />,
      label: `${item.adults} ${item.adults === 1 ? tHotelsCard("adult") : tHotelsCard("adults")}${item.children > 0 ? `, ${item.children} ${item.children === 1 ? tHotelsCard("child") : tHotelsCard("children")}` : ""}`,
    },
  ];

  return (
    <div className="container my-24">
      {/* Header */}
      <h1 className="text-28 font-bold mb-6">{t("title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===== Left Column: Hotel Info + Room Details ===== */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Hotel Main Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Hotel Image with overlay info */}
            <div className="relative w-full h-[260px] md:h-[340px] overflow-hidden">
              {item.hotelImage && (
                <Image
                  fill
                  className="object-cover"
                  src={item.hotelImage}
                  alt={item.hotelName}
                  priority
                />
              )}
              {/* Gradient overlay for readability */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-3 start-3 end-3 flex flex-wrap items-center justify-between gap-1.5">
                <h2 className="text-22 font-bold text-white drop-shadow-sm">
                  {item.hotelName}
                </h2>
                <StarRating rating={item.starRating} />
              </div>
            </div>

            {/* Info Badges */}
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {infoBadges.map((badge) => (
                  <div
                    key={badge.key}
                    className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium"
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                ))}
                {/* Refundability */}
                {pkg?.refundability !== undefined && (
                  pkg.refundability === 1 ? (
                    <span className="inline-flex items-center gap-1 text-green-600 text-13
                      bg-green-50 rounded-lg px-3 py-2 ">
                      {pkg.refundableText || t("refundable")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1
                      text-red-600 text-13 bg-red-50 rounded-lg px-3 py-2 ">
                      {pkg.refundableText || t("nonRefundable")}
                    </span>
                  )
                )}
              </div>

              {/* Room Details Card */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-4">
                {/* Section Header */}
                <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
                  <MdMeetingRoom size={18} className="text-primary" />
                  <h3 className="text-16 font-bold">{t("roomDetails")}</h3>
                </div>

                <div className="p-4 md:p-5">
                  {/* Package Images */}
                  {packageImages.length > 0 && (
                    <div className="mb-4">
                      <PackageImages isSmall={false} selectedImages={packageImages} />
                    </div>
                  )}

                  {/* Rooms List */}
                  <div className="flex flex-col gap-3">
                    {pkg?.rooms?.map((room: any, idx: number) => (
                      <div
                        key={room.id || idx}
                        className="bg-gray-50 rounded-xl p-3 md:p-4 border border-gray-200"
                      >
                        <h4 className="text-18 font-bold mb-3">{room.roomName}</h4>
                        <div className="flex flex-wrap gap-4">
                          {room.roomType && (
                            <div className="flex items-center gap-2 text-14 text-gray-600">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                                <IoMdBed size={18} className="text-primary" />
                              </div>
                              <div>
                                <div className="text-11 text-gray-400">
                                  {tHotelsCard("bedType")}
                                </div>
                                <div className="font-medium">{room.roomType}</div>
                              </div>
                            </div>
                          )}
                          {room.roomBasis && (
                            <div className="flex items-center gap-2 text-14 text-gray-600">
                              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
                                <FaUtensils size={14} className="text-primary" />
                              </div>
                              <div>
                                <div className="text-11 text-gray-400">
                                  {tHotelsCard("meals")}
                                </div>
                                <div className="font-medium">{room.roomBasis}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* ===== Right Column: Price Summary ===== */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden sticky top-12">
            {/* Summary Header */}
            <div className="px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
              <h3 className="text-16 font-bold">{t("priceSummary")}</h3>
            </div>

            <div className="p-4 flex flex-col gap-4">
              {/* Price Per Night */}
              <div className="flex items-center justify-between text-14 font-medium text-gray-500">
                <span>{t("pricePerNight")}</span>
                <div className="flex items-center gap-1 rtl:flex-row-reverse">
                  <CurrencySymbol size="sm" />
                  {formatePrice(Number(pkg?.price?.finalPrice || 0))}
                </div>
              </div>

              {/* Nights */}
              <div className="flex items-center justify-between text-14 font-medium text-gray-500">
                <span>{tHotelsCard("nights")}</span>
                <span>{item.nights}</span>
              </div>

              <div className="border-t border-dashed border-gray-300" />

              {/* Total Price */}
              <div className="flex items-center justify-between">
                <span className="text-16 font-bold">{t("totalPrice")}</span>
                <div className="flex items-center gap-1 rtl:flex-row-reverse">
                  <CurrencySymbol size="md" />
                  <span className="text-24 font-bold text-primary">
                    {formatePrice(totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBookingPage;
