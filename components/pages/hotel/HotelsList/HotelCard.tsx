"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  FaMapMarkerAlt,
  FaStar,
  FaRegStar,
  FaCoffee,
  FaClock,
  FaUser,
} from "react-icons/fa";
import { hotelSeachTypes } from "@/types/hotels";
import PriceCell from "@/components/shared/PriceCell";
import StarRating from "@/components/shared/StarRating";
import { useTranslations } from "next-intl";
import { localStorageHotelKey } from "@/constants";

const HotelCard = ({
  hotel,
  uuid,
  nights,
  adults,
  children,
}: {
  hotel: hotelSeachTypes;
  uuid: string;
  nights?: number;
  adults?: number;
  children?: number;
}) => {
  const t = useTranslations("HotelsList.HotelCard");
  const onSeeAvailability = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(localStorageHotelKey, JSON.stringify(hotel));
    }
  };

  const price = hotel?.price;
  const formattedPrice = parseFloat(price.toString().replace(/[^\d.]/g, ""));

  const starRating = hotel?.starRating ? Number(hotel?.starRating) : 0;

  const hasBreakfast =
    hotel?.facilities?.some((f: any) =>
      f?.name?.toLowerCase().includes("breakfast")
    ) || false;

  return (
    <Link
      href={`/hotels/${hotel.id}/${uuid}`}
      onClick={onSeeAvailability}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden p-2 
      group
      flex items-center flex-col sm:flex-row gap-2 mb-4 hover:bg-gray-50 transition-all duration-300"
    >
      {hotel?.defaultImage?.FullSize && (
        <div className="relative shrink-0 w-full sm:w-[220px] sm:h-[220px] overflow-hidden sm:rounded-s-lg sm:rounded-e-none rounded-lg">
          <Image
            width={700}
            height={700}
            className="w-full h-full sm:h-[220px] sm:w-[220px] object-cover 
            group-hover:scale-105 transition-all duration-300
            "
            src={hotel?.defaultImage?.FullSize || "/img/hotels/placeholder.jpg"}
            alt={hotel?.displayName || t("hotelName")}
            priority
          />
        </div>
      )}

      {/* Hotel Details Section */}
      <div className="flex flex-col gap-2 p-2 w-full">
        <div className="flex items-start justify-between sm:gap-5 gap-3 flex-col sm:flex-row w-full">
          <div className="flex flex-col gap-2.5">
            {/* Hotel Name */}
            <div className="">
              <h4 className="text-22 font-bold">{hotel?.displayName}</h4>
              <h5 className="text-16 font-bold">{hotel?.displayNameAr}</h5>
            </div>
            {/* Location */}
            <div className="flex items-center gap-1.5 text-gray-500">
              <FaMapMarkerAlt size={16} className="text-gray-400 min-w-4" />
              <div className="text-16 line-clamp-2">{hotel?.address}</div>
            </div>

            {/* Breakfast Included */}
            {hasBreakfast && (
              <div className="flex items-center gap-1.5 text-gray-500">
                <FaCoffee size={16} className="text-gray-400" />
                <span className="text-16">{t("breakfastIncluded")}</span>
              </div>
            )}

            {/* Nights, Adults, Children */}
            {(nights || adults || children) && (
              <div className="flex items-center gap-1.5 text-gray-500 text-16">
                {nights && (
                  <div className="flex items-center gap-1.5 me-2">
                    <FaClock size={15} className="text-gray-400" />
                    {nights} {nights === 1 ? t("night") : t("nights")}
                  </div>
                )}
                {(adults || children) && (
                  <>
                    <FaUser size={15} className="text-gray-400" />
                    <span className="text-16">
                      {adults} {adults === 1 ? t("adult") : t("adults")}
                      {children
                        ? ` ${children} ${children === 1 ? t("child") : t("children")
                        }`
                        : ""}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="flex flex-col  ">
            {/* Price */}
            <PriceCell price={formattedPrice} nights={nights || 1} />
            {/* Star Rating */}
            <StarRating rating={starRating} />
          </div>
        </div>

        {/* Description */}
        <div className="text-gray-500 text-16 line-clamp-2 mt-3">
          {hotel?.description || hotel?.locationDetails}
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
