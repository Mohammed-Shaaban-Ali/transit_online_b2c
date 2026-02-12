"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { BiHomeAlt2 } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { useGetHotelDetailsQuery } from "@/redux/features/hotels/hotelsApi";
import { hotelSeachTypes } from "@/types/hotels";
import { useTranslations } from "next-intl";

import AvailableRooms from "./AvailableRooms";
import Facilities from "./Facilities";
import GalleryOne from "./GalleryOne";
import SingleHotelSkeleton from "./Skeleton";
import { getSearchParamsData } from "@/utils/getSearchParams";
import { Button } from "@/components/ui/button";
import ExpiredDialog from "@/components/shared/ExpiredDialog";
import { localStorageHotelKey } from "@/constants";

type Props = {
  hotelID: string;
  uuid: string;
};

function SingleHotel({ hotelID, uuid }: Props) {
  const t = useTranslations("SingleHotel");
  const tError = useTranslations("SingleHotel.error");
  const router = useRouter();
  const [nights, setNights] = useState<number | undefined>(undefined);
  const [adults, setAdults] = useState<number | undefined>(undefined);
  const [children, setChildren] = useState<number | undefined>(undefined);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const { data, isFetching, error } = useGetHotelDetailsQuery({
    hotelID,
    uuid,
  });

  const [hotelData, setHotelData] = useState<
    hotelSeachTypes & {
      packages: any[];
      facilities?: any[];
      gallery?: string[];
      price?: number;
      currency?: string;
    }
  >();

  useEffect(() => {
    const LocalStorage = localStorage.getItem(localStorageHotelKey);
    if (!LocalStorage) return;

    const parsedHotel = JSON.parse(LocalStorage);
    // Find the package with the lowest price
    const sortedPackages = [...(data?.packages || [])].sort(
      (a, b) => (a.price?.finalPrice || 0) - (b.price?.finalPrice || 0)
    );
    const cheapestPackage = sortedPackages[0];

    const hotel = {
      id: parsedHotel.id || 0,
      address: parsedHotel.address || "",
      propertyType: parsedHotel.propertyType || "",
      displayName: parsedHotel.displayName || "",
      displayNameAr: parsedHotel.displayNameAr || "",
      defaultImage: parsedHotel.defaultImage || {},
      tripAdvisor: parsedHotel.tripAdvisor || {},
      location: parsedHotel.location || {},
      reviews: parsedHotel.reviews || {},
      starRating: parsedHotel.starRating || "",
      packages: data?.packages || [],
      facilities: data?.hotelContent?.facilities || [],
      gallery: data?.hotelContent?.images || [],
      price: cheapestPackage?.price?.finalPrice || 0,
      currency: cheapestPackage?.price?.currency || "EGP",
    };

    setHotelData(hotel);
  }, [data]);
  // Calculate nights from search data
  useEffect(() => {
    const calculateNights = (checkIn: string, checkOut: string): number => {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const searchData = getSearchParamsData();
    if (searchData?.checkIn && searchData?.checkOut) {
      const calculatedNights = calculateNights(
        searchData.checkIn,
        searchData.checkOut
      );
      setNights(calculatedNights);
    }
    if (searchData?.rooms) {
      setAdults(
        searchData?.rooms?.reduce(
          (sum: number, room: any) => sum + room.AdultsCount,
          0
        )
      );
      setChildren(
        searchData?.rooms?.reduce(
          (sum: number, room: any) => sum + (room.KidsAges?.length || 0),
          0
        )
      );
    }
  }, []);

  if (isFetching) {
    return <SingleHotelSkeleton />;
  }

  if (error) {
    const errorData = (error as any)?.data;
    if (errorData?.error_code === "EXPIRED_HOTELS") {
      return <ExpiredDialog isFlight={false} />;
    }

    return (
      <div className="container mx-auto px-4">
        <div className="min-h-screen flex flex-col justify-center items-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-red-600 mb-4">
              {tError("title")}
            </h1>
            <p className="text-xl text-gray-600 mb-2">{tError("message")}</p>
            <p className="text-lg text-gray-500 mb-8">{tError("tryAgain")}</p>
            <div className="flex gap-3 justify-center">
              <Button size="lg" onClick={() => router.push("/")}>
                <BiHomeAlt2 size={20} />
                {tError("goHome")}
              </Button>
              <Button
                size="lg"
                onClick={() => router.push("/search")}
                variant="outline-primary"
              >
                <FaSearch size={18} />
                {tError("searchHotels")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 container ">
      <GalleryOne hotel={hotelData} nights={nights} />

      {data?.hotelContent?.descriptions &&
        data?.hotelContent?.descriptions.length > 0 && (
          <section className="pt-8">
            <h3 className="text-22 font-bold mb-3">{t("overview")}</h3>
            <div className="space-y-2">
              <div
                className={`text-16 leading-relaxed text-gray-600 ${!isOverviewExpanded ? "line-clamp-3" : ""
                  }`}
              >
                {data?.hotelContent?.descriptions?.map(
                  (des: {
                    line: number;
                    description: string;
                    language: string;
                  }) => (
                    <p key={des.line}>{des.description}</p>
                  )
                )}
              </div>
              {data?.hotelContent?.descriptions &&
                data.hotelContent.descriptions.length > 0 && (
                  <button
                    onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                    className="text-primary hover:underline font-medium text-sm mt-1 transition-colors"
                  >
                    {isOverviewExpanded ? t("showLess") : t("showMore")}
                  </button>
                )}
            </div>
          </section>
        )}
      <AvailableRooms
        hotel={hotelData as any}
        night={Number(nights || 0)}
        adults={Number(adults || 0)}
        children={Number(children || 0)}
      />

      <Facilities amenities={hotelData?.facilities as any} />

      {hotelData?.location?.latitude && hotelData?.location?.longitude && (
        <section className="pt-8">
          <h3 className="text-22 font-bold mb-3">{t("map")}</h3>
          <iframe
            src={`https://maps.google.com/maps?q=${hotelData?.location?.latitude},${hotelData?.location?.longitude}&hl=en&z=14&output=embed`}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      )}
    </section>
  );
}

export default SingleHotel;
