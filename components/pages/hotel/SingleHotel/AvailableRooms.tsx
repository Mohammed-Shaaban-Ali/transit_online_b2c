"use client";

import { usePathname } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { useState, useMemo } from "react";
import { FaUtensils } from "react-icons/fa";
import { IoMdBed } from "react-icons/io";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getSearchParamsData } from "@/utils/getSearchParams";
import { toast } from "sonner";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";
import { convertPrice } from "@/config/currency";
import PackageImages from "@/components/shared/PackageImages";
import { localStorageHotelSearchKey, HOTEL_BOOKING_KEY } from "@/constants";
import { useParams } from "next/navigation";

interface GroupedPackage {
  key: string;
  packages: any[];
  lowestPricePackage: any;
}

const AvailableRooms = ({
  hotel,
  isPreview = false,
  night,
  adults,
  children,
}: {
  hotel: {
    packages: any[];
    displayName?: string;
    starRating?: number;
    defaultImage?: any;
    id?: string;
    description?: string;
    locationDetails?: string;
  };
  isPreview?: boolean;
  night: number;
  adults: number;
  children: number;
}) => {
  const params = useParams();
  const uuid = params?.uuid;
  const hotel_Id = params?.hotel_Id;
  const t = useTranslations("AvailableRooms");
  const router = useRouter();

  const handleSelectPackage = (pkg: any) => {
    const searchParams = getSearchParamsData();
    const hotelLocalStorage = localStorage.getItem(localStorageHotelSearchKey);
    let hotelData: any = null;

    if (hotelLocalStorage) {
      try {
        hotelData = JSON.parse(hotelLocalStorage);
      } catch (error) {
        console.error("Error parsing hotel data:", error);
      }
    }

    if (!searchParams?.checkIn || !searchParams?.checkOut) {
      toast.error(t("validation.datesRequired"));
      return;
    }

    // Store hotel booking data in sessionStorage
    const bookingData = {
      hotelId: hotel_Id,
      uuid: uuid,
      hotelName: hotelData?.displayName || hotel?.displayName || "Hotel",
      starRating: Number(hotelData?.starRating || hotel?.starRating || 0),
      hotelImage:
        hotelData?.defaultImage?.FullSize || hotel?.defaultImage?.FullSize,
      package: pkg,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      nights: night,
      adults: adults,
      children: children,
    };

    sessionStorage.setItem(HOTEL_BOOKING_KEY, JSON.stringify(bookingData));
    setShowCustomizeDialog(false);
    router.push(`/hotels/${hotel_Id}/${uuid}/booking`);
  };

  const [showCustomizeDialog, setShowCustomizeDialog] = useState(false);
  const [selectedGroupKey, setSelectedGroupKey] = useState<string | null>(null);

  // Group packages by room type and room name
  const groupedPackages = useMemo(() => {
    if (!hotel?.packages) return [];

    const groupsMap = new Map<string, any[]>();

    hotel.packages.forEach((pkg) => {
      if (!pkg.rooms || pkg.rooms.length === 0) return;

      // Create a key from all rooms in the package (roomType + roomName)
      const roomKeys = pkg.rooms
        .map((room: any) => `${room.roomType || ""}-${room.roomName || ""}`)
        .sort()
        .join("|");

      if (!groupsMap.has(roomKeys)) {
        groupsMap.set(roomKeys, []);
      }
      groupsMap.get(roomKeys)?.push(pkg);
    });

    // Convert to array and find lowest price package for each group
    const grouped: GroupedPackage[] = Array.from(groupsMap.entries()).map(
      ([key, packages]) => {
        // Find package with lowest price
        const lowestPricePackage = packages.reduce((lowest, current) => {
          const lowestPrice = lowest.price?.finalPrice || Infinity;
          const currentPrice = current.price?.finalPrice || Infinity;
          return currentPrice < lowestPrice ? current : lowest;
        }, packages[0]);

        return {
          key,
          packages,
          lowestPricePackage,
        };
      }
    );

    return grouped;
  }, [hotel?.packages]);

  // Get packages for selected group key
  const selectedGroupPackages = useMemo(() => {
    if (!selectedGroupKey) return [];
    return (
      groupedPackages.find((group) => group.key === selectedGroupKey)
        ?.packages || []
    );
  }, [selectedGroupKey, groupedPackages]);

  const handleCustomizeRoom = (groupKey: string) => {
    setSelectedGroupKey(groupKey);
    setShowCustomizeDialog(true);
  };

  if (!hotel?.packages || hotel.packages.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">{t("noRooms")}</p>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <h2 className="text-22 font-bold mb-3">{t("title")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {groupedPackages.map((group, groupIndex) => {
          const pkg = group.lowestPricePackage;
          const packageImages =
            pkg.images && pkg.images.length > 0
              ? pkg.images
              : pkg.rooms?.[0]?.images || [];

          return (
            <div key={groupIndex} className="w-full h-full text-[#525252]!">
              <div className="bg-white rounded-2xl h-full relative overflow-hidden border border-gray-200 p-2.5">
                <PackageImages selectedImages={packageImages} />
                <div className="pt-2.5 pb-1 flex flex-col ">
                  {pkg?.rooms?.map((room: any) => (
                    <div key={room.id} className="py-1 flex flex-col ">
                      <h3 className="text-22 font-bold line-clamp-1 mb-2">
                        {room.roomName}
                      </h3>
                      <div className="grid text-15 grid-cols-2 gap-4 mb-1 border-b border-gray-200 pb-2 ">
                        {/* Bed Type */}
                        {room.roomType && (
                          <div className="flex items-center gap-1 ">
                            <IoMdBed
                              size={20}
                              className="text-primary min-w-[20px]"
                            />
                            <span>
                              {t("bedType")} {room.roomType}
                            </span>
                          </div>
                        )}
                        {/* Meals */}
                        {room.roomBasis && (
                          <div className="flex items-center gap-1 ">
                            <FaUtensils
                              size={14}
                              className="text-primary min-w-[14px]"
                            />
                            <span>
                              {t("meals")} {room.roomBasis}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* Cancellation Policy */}
                  <div className="flex items-center gap-2 justify-between mb-2">
                    {/* Availability */}
                    <div className="text-14 ms-auto">
                      <span className="flex items-center gap-1 ">
                        {group.packages.length === 1
                          ? t("onlyOnePackage")
                          : `${group.packages.length} ${t(
                            "packagesAvailable"
                          )}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 justify-between ">
                    {/* Guests */}
                    {pkg?.rooms?.[0]?.adultsCount && (
                      <div className="flex items-center gap-2 text-14">
                        {t("guests")} ({adults}{" "}
                        {adults === 1 ? t("adult") : t("adults")}
                        {children > 0 &&
                          `, ${children} ${children === 1 ? t("child") : t("children")
                          }`}
                        )
                      </div>
                    )}

                    {/* Price */}
                    <div className="flex flex-col items-end">
                      <div style={{ fontSize: "11px" }}>
                        ({Math.ceil(convertPrice(Number(pkg?.price?.finalPrice || 0)))} *{night} {t("nights")})
                      </div>

                      <div className="text-16  flex items-center rtl:flex-row-reverse gap-1 font-medium  text-primary -mt-0.5">
                        <CurrencySymbol size="sm" />
                        {formatePrice(
                          Number(pkg?.price?.finalPrice || 0) * night
                        )}
                        <div
                          style={{ fontSize: "9px" }}
                          className="text-gray-500 mt-auto"
                        >
                          {t("startWith")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full rounded-full h-10 mt-2 bg-primary/20 text-primary hover:text-white"
                  onClick={() => handleCustomizeRoom(group.key)}
                >
                  {t("roomOptions")}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customize Room Dialog */}
      <Dialog
        open={showCustomizeDialog && !!selectedGroupKey}
        onOpenChange={setShowCustomizeDialog}
      >
        <DialogContent
          className="max-w-6xl max-h-[90vh] w-[95vw] md:w-auto md:min-w-[400px] overflow-y-auto p-0 rounded-2xl"
          showCloseButton={true}
        >
          <DialogHeader
            className="bg-gray-200  flex items-center justify-between
           px-4 py-3 rounded-t-2xl flex-row text-left "
          >
            <DialogTitle className="text-lg font-bold text-black m-0">
              {t("roomOptions")}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 py-2">
            <div className="flex flex-col gap-3">
              {selectedGroupPackages.map((pkg, pkgIndex) => {
                const packageName = pkg?.rooms?.[0]?.roomBasis || t("package");
                return (
                  <div key={pkgIndex} className="w-full">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 md:p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        {/* Package Info */}
                        <div className="flex flex-col gap-1 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {packageName}
                          </p>
                          {pkg?.refundability === 1 ? (
                            <p className="text-green-600 text-xs">
                              {pkg?.refundableText || t("refundable")}
                            </p>
                          ) : (
                            <p className="text-red-600 text-xs">
                              {pkg?.refundableText || t("nonRefundable")}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-end">
                          <div style={{ fontSize: "11px" }}>
                            ({Math.ceil(convertPrice(Number(pkg?.price?.finalPrice || 0)))} *{night} {t("nights")})
                          </div>

                          <div className="text-16  flex items-center gap-1 font-medium  text-primary -mt-0.5">
                            <CurrencySymbol size="sm" />
                            {formatePrice(
                              Number(pkg?.price?.finalPrice || 0) * night
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Select Package Button */}
                      {!isPreview && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleSelectPackage(pkg)}
                            className="
                          mt-2 max-w-1/2  
                          w-full rounded-lg h-9 bg-primary text-white hover:bg-primary/90 text-sm"
                          >
                            {t("selectPackage")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableRooms;
