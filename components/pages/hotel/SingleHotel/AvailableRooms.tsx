"use client";

import { useRouter } from "@/i18n/navigation";
import { useState, useMemo } from "react";
import { FaUser, FaChild } from "react-icons/fa";
// import { IoMdBed } from "react-icons/io";
import { BsCheckCircleFill, BsCameraFill } from "react-icons/bs";
import { HiLightningBolt } from "react-icons/hi";
import { MdCreditCard } from "react-icons/md";
// import { MdSmokeFree, MdSecurity } from "react-icons/md";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  // Building2,
  // Ruler,
  // Wifi,
  // Wind,
  // Bath,
  // Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getSearchParamsData } from "@/utils/getSearchParams";
import { toast } from "sonner";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";
import { localStorageHotelSearchKey, HOTEL_BOOKING_KEY } from "@/constants";
import { useParams } from "next/navigation";
import Image from "next/image";

interface GroupedPackage {
  key: string;
  packages: any[];
  lowestPricePackage: any;
}

// ─── Image Slider ─────────────────────────────────────────────────────────────
const RoomImageSlider = ({ images }: { images: string[] }) => {
  const [current, setCurrent] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[210px] bg-gray-100 rounded-md flex items-center justify-center">
        <BsCameraFill size={28} className="text-gray-300" />
      </div>
    );
  }

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrent((c) => (c + 1) % images.length);
  };

  return (
    <>
      <div className="relative w-full h-[210px] rounded-md overflow-hidden">
        <Image
          src={images[current]}
          alt={`Room image ${current + 1}`}
          fill
          className="object-cover"
          sizes="280px"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute start-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/55 text-white 
              rounded-full flex items-center justify-center hover:bg-primary transition-colors z-10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute end-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/55 text-white 
              rounded-full flex items-center justify-center hover:bg-primary transition-colors z-10"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Photo count badge */}
        <button
          onClick={() => setDialogOpen(true)}
          className="absolute bottom-2 end-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 hover:bg-black/80 transition-colors z-10"
        >
          <BsCameraFill size={11} />
          <span>{images.length}</span>
        </button>
      </div>

      {/* Full gallery dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-4xl max-h-[80vh] overflow-y-auto p-4 rounded-2xl"
          showCloseButton
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative w-full h-[200px] rounded-lg overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Room image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="300px"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// ─── RoomGroup ────────────────────────────────────────────────────────────────
const RoomGroup = ({
  group,
  night,
  roomsCount,
  adults,
  children,
  isPreview,
  t,
  onSelectPackage,
}: {
  group: GroupedPackage;
  night: number;
  roomsCount: number;
  adults: number;
  children: number;
  isPreview: boolean;
  t: ReturnType<typeof useTranslations<"AvailableRooms">>;
  onSelectPackage: (pkg: any) => void;
}) => {
  const [showAll, setShowAll] = useState(false);

  const firstPkg = group.lowestPricePackage;
  const firstRoom = firstPkg?.rooms?.[0];

  const packageImages: string[] =
    firstPkg?.images?.length > 0 ? firstPkg.images : firstRoom?.images || [];

  const sortedPackages = useMemo(
    () =>
      [...group.packages].sort(
        (a, b) =>
          (a.price?.finalPrice ?? Infinity) - (b.price?.finalPrice ?? Infinity),
      ),
    [group.packages],
  );

  const visiblePackages = showAll ? sortedPackages : sortedPackages.slice(0, 2);
  const hiddenCount = sortedPackages.length - 2;
  const lowestHiddenPrice =
    hiddenCount > 0 ? sortedPackages[2]?.price?.finalPrice : null;

  return (
    <div className="mb-4 bg-white border border-gray-100 rounded-lg p-5 shadow-sm">
      {/* Room name — no outer border */}
      <h3 className="text-2xl font-bold mb-5">{firstRoom?.roomName}</h3>

      <div className="flex flex-col md:flex-row gap-4">
        {/* ── Left: image + room details — NO border ── */}
        <div className="w-full md:w-[360px] shrink-0">
          <RoomImageSlider images={packageImages} />

          {/* Bed type */}
          {/* {firstRoom?.roomType && (
            <div className="mt-3 flex items-center gap-2 font-bold text-[15px] text-gray-800">
              <IoMdBed size={22} className="text-gray-700 min-w-[22px]" />
              <span>{firstRoom.roomType}</span>
            </div>
          )} */}

          {/* Static amenities grid */}
          {/* <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] text-gray-600">
            <div className="flex items-center gap-1.5">
              <Building2 size={14} className="text-primary min-w-[14px]" />
              <span className="text-primary font-medium">City view</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MdSmokeFree size={15} className="text-gray-500 min-w-[15px]" />
              <span>Non-smoking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Ruler size={13} className="text-gray-500 min-w-[13px]" />
              <span>19m²</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers size={13} className="text-gray-500 min-w-[13px]" />
              <span>Floor: 5</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wifi size={13} className="text-gray-500 min-w-[13px]" />
              <span>Free Wi-Fi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind size={13} className="text-gray-500 min-w-[13px]" />
              <span>Air conditioning</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath size={13} className="text-gray-500 min-w-[13px]" />
              <span>Private bathroom</span>
            </div>
          </div> */}

          {/* Room Details link */}
          {/* <button className="mt-3 text-[13px] font-bold text-primary hover:underline">
            {t("roomDetails")}
          </button> */}
        </div>

        {/* ── Right: packages table — HAS its own border ── */}
        <div className="flex-1 min-w-0  rounded-md overflow-hidden">
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[1fr_150px_1fr] bg-gray-100 border border-b-0 border-gray-200">
            <div className="px-4 py-2.5 text-14 font-bold text-gray-700">
              {t("yourChoices")}
            </div>
            <div className="px-4 py-2.5 text-14 font-bold text-gray-700 text-center">
              {t("sleeps")}
            </div>
            <div className="px-4 py-2.5 text-14 font-bold text-gray-700 text-center">
              {t("todayPrice")}
            </div>
          </div>

          {/* Package rows */}
          {visiblePackages.map((pkg, pkgIndex) => {
            const originalPrice = pkg.price?.originalPrice;
            const finalPrice = pkg.price?.finalPrice ?? 0;
            const hasDiscount =
              originalPrice && Number(originalPrice) > Number(finalPrice);
            const discountPercent = hasDiscount
              ? Math.round(
                  (1 - Number(finalPrice) / Number(originalPrice)) * 100,
                )
              : 0;
            const sumAdults =
              pkg.rooms?.reduce(
                (sum: number, room: any) =>
                  sum + (Number(room?.adultsCount) || 0),
                0,
              ) ?? 0;
            const sumChildren =
              pkg.rooms?.reduce(
                (sum: number, room: any) =>
                  sum + (room?.kidsAges?.length ?? 0),
                0,
              ) ?? 0;
            const displayAdults = sumAdults > 0 ? sumAdults : adults;
            const displayChildren = sumChildren > 0 ? sumChildren : children;
            const isRefundable = pkg.refundability === 1;

            return (
              <div
                key={pkgIndex}
                className="flex flex-col md:grid md:grid-cols-[1fr_150px_1fr] border border-t-0 border-gray-200"
              >
                {/* ── Your Choices ── */}
                <div className="px-4 py-3 flex flex-col gap-2">
                  {isRefundable ? (
                    <div className="flex items-start gap-1.5">
                      <BsCheckCircleFill
                        size={14}
                        className="text-teal-600 mt-0.5 min-w-[14px]"
                      />
                      <span className="text-teal-600 text-[13px] font-medium leading-snug">
                        {pkg.refundableText || t("freeCancellation")}
                      </span>
                      <Info
                        size={14}
                        className="text-gray-400 mt-0.5 min-w-[14px] cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Info size={14} className="text-red-400 min-w-[14px]" />
                      <span className="text-red-500 text-[13px] font-medium">
                        {pkg.refundableText || t("nonRefundable")}
                      </span>
                    </div>
                  )}

                  {/* <div className="flex items-center gap-1.5 text-[13px] text-teal-600">
                    <MdSecurity
                      size={15}
                      className="text-teal-500 min-w-[15px]"
                    />
                    <span>{t("lateCheckout")}</span>
                  </div> */}

                  <div className="flex items-center gap-1.5 text-[13px] text-teal-600">
                    <HiLightningBolt
                      size={14}
                      className="text-yellow-400 min-w-[14px]"
                    />
                    <span>{t("instantConfirmation")}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[13px] text-gray-700">
                    <MdCreditCard
                      size={15}
                      className="text-gray-700 min-w-[15px]"
                    />
                    <span>{t("prepayOnline")}</span>
                  </div>

                  {/* Mobile: occupancy (same as Sleeps column) */}
                  <div className="md:hidden flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-gray-700 pt-1">
                    <span className="inline-flex items-center gap-1">
                      <FaUser size={12} className="text-gray-600 shrink-0" />
                      {displayAdults}{" "}
                      {displayAdults === 1 ? t("adult") : t("adults")}
                    </span>
                    {displayChildren > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <FaChild
                          size={11}
                          className="text-orange-500 shrink-0"
                        />
                        {displayChildren}{" "}
                        {displayChildren === 1 ? t("child") : t("children")}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* ── Sleeps ── */}
                <div
                  className="hidden md:flex px-2 py-3 flex-col items-center justify-center gap-1.5 border-x text-center"
                  title={
                    displayChildren > 0
                      ? `${displayAdults} ${displayAdults === 1 ? t("adult") : t("adults")}, ${displayChildren} ${displayChildren === 1 ? t("child") : t("children")}`
                      : `${displayAdults} ${displayAdults === 1 ? t("adult") : t("adults")}`
                  }
                >
                  <div className="flex items-center gap-1 text-[13px] text-gray-800">
                    <FaUser size={13} className="text-gray-600 shrink-0" />
                    <span>
                      {displayAdults}{" "}
                      {displayAdults === 1 ? t("adult") : t("adults")}
                    </span>
                  </div>
                  {displayChildren > 0 ? (
                    <div className="flex items-center gap-1 text-[13px] text-gray-800">
                      <FaChild
                        size={12}
                        className="text-orange-500 shrink-0"
                      />
                      <span>
                        {displayChildren}{" "}
                        {displayChildren === 1 ? t("child") : t("children")}
                      </span>
                    </div>
                  ) : null}
                  <Info
                    size={13}
                    className="text-gray-400 cursor-pointer shrink-0"
                    aria-hidden
                  />
                </div>

                {/* ── Today's Price ── */}
                <div className="px-4 py-3 flex flex-col items-end justify-center gap-1">
                  {hasDiscount && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-semibold text-pink-600">
                        {t("specialDiscount")}
                      </span>
                      <span className="bg-red-500 text-white text-[11px] px-1.5 py-0.5 rounded font-bold leading-none">
                        {discountPercent}% {t("off")}
                      </span>
                    </div>
                  )}

                  {hasDiscount && (
                    <div className="text-gray-400 line-through text-[13px] leading-none">
                      <CurrencySymbol size="sm" />
                      {formatePrice(Number(originalPrice))}
                    </div>
                  )}

                  <div className="flex items-baseline gap-0.5 leading-none">
                    <span className="text-[13px] font-medium text-gray-700">
                      <CurrencySymbol size="sm" />
                    </span>
                    <span className="text-[26px] font-bold text-gray-900">
                      {formatePrice(Number(finalPrice))}
                    </span>
                  </div>

                  <div className="text-gray-500 text-[11px] text-end leading-snug">
                    {t("roomNightsInclTaxes", {
                      roomCount: roomsCount,
                      nightCount: night,
                    })}
                  </div>

                  {!isPreview && (
                    <Button
                      onClick={() => onSelectPackage(pkg)}
                      className="mt-1.5 w-full max-w-[200px]"
                    >
                      {t("reserve")}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}

          {/* ── Show more / Show less ── */}
          {sortedPackages.length > 2 && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="w-full py-2.5 text-sm font-bold text-primary hover:bg-primary/10 flex items-center justify-center gap-1.5 transition-colors border-t border-gray-100"
            >
              {showAll ? (
                <>
                  {t("showLess")}
                  <ChevronUp size={15} />
                </>
              ) : (
                <>
                  {t("showMoreRates", { count: hiddenCount })}
                  {lowestHiddenPrice != null && (
                    <span>
                      ({t("from")} <CurrencySymbol size="sm" />
                      {formatePrice(Number(lowestHiddenPrice))})
                    </span>
                  )}
                  <ChevronDown size={15} />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── AvailableRooms ───────────────────────────────────────────────────────────
const AvailableRooms = ({
  hotel,
  isPreview = false,
  night,
  roomsCount,
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
  roomsCount: number;
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
    router.push(`/hotels/details/${hotel_Id}/${uuid}/booking`);
  };

  const groupedPackages = useMemo(() => {
    if (!hotel?.packages) return [];

    const groupsMap = new Map<string, any[]>();

    hotel.packages.forEach((pkg) => {
      if (!pkg.rooms || pkg.rooms.length === 0) return;

      const roomKeys = pkg.rooms
        .map((room: any) => `${room.roomType || ""}-${room.roomName || ""}`)
        .sort()
        .join("|");

      if (!groupsMap.has(roomKeys)) {
        groupsMap.set(roomKeys, []);
      }
      groupsMap.get(roomKeys)?.push(pkg);
    });

    return Array.from(groupsMap.entries()).map(([key, packages]) => {
      const lowestPricePackage = packages.reduce((lowest, current) => {
        const lowestPrice = lowest.price?.finalPrice ?? Infinity;
        const currentPrice = current.price?.finalPrice ?? Infinity;
        return currentPrice < lowestPrice ? current : lowest;
      }, packages[0]);

      return { key, packages, lowestPricePackage } as GroupedPackage;
    });
  }, [hotel?.packages]);

  if (!hotel?.packages || hotel.packages.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">{t("noRooms")}</p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      {groupedPackages.map((group, groupIndex) => (
        <RoomGroup
          key={groupIndex}
          group={group}
          night={night}
          roomsCount={roomsCount}
          adults={adults}
          children={children}
          isPreview={isPreview}
          t={t}
          onSelectPackage={handleSelectPackage}
        />
      ))}
    </div>
  );
};

export default AvailableRooms;
