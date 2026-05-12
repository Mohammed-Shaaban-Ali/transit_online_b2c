"use client";

import { FaRegCalendar } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { useTranslations, useLocale } from "next-intl";

interface DatesCardProps {
  checkIn: string;
  checkOut: string;
  nights: number;
  roomsCount?: number;
  checkInTime?: string;
  checkOutTime?: string;
}

const formatDateShort = (date: string, locale: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString(locale === "ar" ? "ar" : "en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const DatesCard = ({
  checkIn,
  checkOut,
  nights,
  roomsCount = 1,
  checkInTime = "14:30-06:00",
  checkOutTime = "12:00",
}: DatesCardProps) => {
  const t = useTranslations("HotelBooking");
  const tHotelsCard = useTranslations("HotelsCard");
  const locale = useLocale();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-4 pb-2">
      <div>
        <h4 className="text-18 font-bold mb-3">
          {formatDateShort(checkIn, locale)} - {formatDateShort(checkOut, locale)}
        </h4>
        <div className="space-y-1 text-14">
          <div className="text-gray-600">
            <span>{t("checkIn")}:</span> <span>{checkInTime}</span>
          </div>
          <div className="text-gray-600">
            <span>{t("checkOut")}:</span>{" "}
            <span>
              {t("before")} {checkOutTime}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 flex items-stretch mt-5">
        <button
          type="button"
          className="flex-1 flex items-center justify-between hover:bg-gray-50 transition-colors py-3"
        >
          <div className="flex items-center gap-1.5 text-base">
            <FaRegCalendar size={16} className="text-gray-600" />
            <span>
              {nights}{" "}
              {nights === 1 ? tHotelsCard("night") : tHotelsCard("nights")}
            </span>
          </div>
        </button>

        <div className="w-px bg-gray-200 my-2" />

        <button
          type="button"
          className="flex-1 flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-1.5 text-base">
            <MdMeetingRoom size={16} className="text-gray-600" />
            <span>
              {roomsCount} {roomsCount === 1 ? t("room") : t("rooms")}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default DatesCard;
