"use client";

import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { BsCheckCircleFill } from "react-icons/bs";
import { useTranslations } from "next-intl";

interface HotelDetailsCardProps {
  hotelName: string;
  hotelImage?: string;
  starRating: number;
  firstRoom?: any;
  adultsCount: number;
  refundability?: number;
  refundableText?: string;
  reviewScore?: string;
  reviewCount?: number;
  roomSize?: string;
  floor?: number;
}

const HotelDetailsCard = ({
  hotelName,
  hotelImage,
  starRating,
  firstRoom,
  adultsCount,
  refundability,
  refundableText,
  reviewScore,
  reviewCount = 1525,
  roomSize = "18m²",
  floor = 5,
}: HotelDetailsCardProps) => {
  const t = useTranslations("HotelBooking");

  const ratingScore = reviewScore || (starRating * 2).toFixed(1);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4">
        {/* Hotel image + name + rating */}
        <div className="flex gap-3 items-center">
          <div className="relative w-[110px] h-[140px] rounded-md overflow-hidden shrink-0 bg-gray-100">
            {hotelImage && (
              <Image
                fill
                src={hotelImage}
                alt={hotelName}
                className="object-cover"
                sizes="110px"
                priority
              />
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <h3 className="text-18 font-bold leading-snug flex-1 min-w-0">
              {hotelName}
            </h3>

            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              <div
                className="flex h-7 min-w-10 items-center justify-center rounded-xl rounded-tr-none
                bg-primary px-2 text-[14px] font-bold text-white shrink-0"
              >
                {ratingScore}/10
              </div>
              <span className="text-primary text-base font-semibold cursor-pointer">
                {t("excellent")}
              </span>
              <span className="text-gray-500 text-base">
                {reviewCount.toLocaleString()} {t("reviews")}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-4" />

        {/* Room details */}
        {firstRoom && (
          <div>
            <h4 className="text-20 font-bold mb-3">{firstRoom.roomName}</h4>

            <div className="flex flex-wrap items-center gap-1.5 text-base text-gray-700 leading-relaxed font-normal">
              <span className="flex items-center gap-1">
                <FaUser size={11} className="text-gray-700" />x{adultsCount}
              </span>
              {firstRoom.roomType && (
                <>
                  <span className="text-gray-400">·</span>
                  <span>{firstRoom.roomType}</span>
                </>
              )}
              <span className="text-gray-400">·</span>
              <span className="text-primary border-b border-dashed border-primary cursor-pointer">
                {t("freeWifi")}
              </span>
              <span className="text-gray-400">·</span>
              <span>{t("nonSmoking")}</span>
              <span className="text-gray-400">·</span>
              <span>{t("noWindows")}</span>
              <span className="text-gray-400">·</span>
              <span>{roomSize}</span>
              <span className="text-gray-400">·</span>
              <span>
                {t("floor")}: {floor}
              </span>
            </div>

            {/* Free cancellation */}
            {refundability === 1 && (
              <div className="mt-4 flex items-center gap-1.5 text-teal-600 text-base">
                <BsCheckCircleFill
                  size={16}
                  className="text-teal-600 min-w-5"
                />
                <span className="font-medium border-b border-dashed border-teal-600 cursor-pointer">
                  {refundableText || t("freeCancellation")}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetailsCard;
