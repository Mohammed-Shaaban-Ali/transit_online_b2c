"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";
import {
  Images,
  Heart,
  Share2,
  CheckCircle,
  ChevronRight,
  Train,
  Plane,
  TrainFront,
} from "lucide-react";
import PriceCell from "@/components/shared/PriceCell";
import StarRating from "@/components/shared/StarRating";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocale, useTranslations } from "next-intl";

const STATIC_SURROUNDINGS = [
  { Icon: Train, label: "Metro: Shangcheng Road", distance: "440 m" },
  { Icon: Train, label: "Metro: South Pudong Road", distance: "700 m" },
  {
    Icon: Plane,
    label: "Airport: Shanghai Hongqiao International",
    distance: "22.6 km",
  },
  {
    Icon: Plane,
    label: "Airport: Shanghai Pudong International",
    distance: "36.3 km",
  },
  {
    Icon: TrainFront,
    label: "Train: Shanghai Railway Station",
    distance: "9.4 km",
  },
];

function getRatingLabel(score: number) {
  if (score >= 9) return "outstanding";
  if (score >= 8) return "excellent";
  if (score >= 7) return "veryGood";
  return "good";
}

type GalleryOneProps = {
  hotel: any;
  nights?: number;
  /** Opens embedded map dialog when coordinates exist */
  onOpenMap?: () => void;
};

export default function GalleryOne({ hotel, nights, onOpenMap }: GalleryOneProps) {
  const t = useTranslations("GalleryOne");
  const locale = useLocale();
  const [isOpen, setOpen] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const allImages = hotel?.gallery || [];
  const facilities: any[] = hotel?.facilities || [];
  const starRating = hotel?.starRating ? Number(hotel.starRating) : 0;
  const ratingScore = starRating > 0 ? Math.min(10, starRating * 2) : 0;
  const ratingLabelKey = getRatingLabel(ratingScore);
  const highlightFacilities = facilities.slice(0, 6);
  const amenitiesFacilities = showAllAmenities
    ? facilities
    : facilities.slice(0, 8);

  if (!hotel || !allImages.length) return null;

  return (
    <>
      <section className="pt-14">
        <div className="bg-white rounded-lg p-5 shadow">
          {/* Hotel Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-6">
            {/* Left: name, stars, address */}
            <div className="flex flex-col flex-1 gap-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-3xl font-bold leading-tight">
                  {locale === "ar" ? hotel?.displayNameAr : hotel?.displayName}
                </h1>
                <StarRating rating={Number(hotel?.starRating)} />
                {hotel?.openedYear && (
                  <span className="text-xs text-gray-500 border border-gray-300 px-2 py-0.5 rounded whitespace-nowrap">
                    Opened in {hotel.openedYear}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-gray-500 text-lg font-normal flex-wrap">
                <FiMapPin className="w-4 h-4 shrink-0" />
                <span>{hotel?.address}</span>
                {onOpenMap ? (
                  <button
                    type="button"
                    onClick={onOpenMap}
                    className="text-primary ms-1 whitespace-nowrap font-medium hover:underline"
                  >
                    {t("showOnMap")}
                  </button>
                ) : (
                  <span className="ms-1 whitespace-nowrap text-gray-400">
                    {t("showOnMap")}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Price + We Price Match + Button */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex flex-col ">
                <PriceCell
                  price={hotel?.price}
                  priceClassName="text-black! text-2cl"
                />
                <div className="flex items-center gap-1 text-primary text-sm underline font-bold">
                  <img
                    src="https://dimg04.tripcdn.com/images/1re3u12000nzm6m3018B9.png"
                    alt="check"
                    width={16}
                    height={16}
                  />

                  <span>{t("wePriceMatch")}</span>
                </div>
              </div>
              <Button size="lg" className="h-14">
                {t("selectRooms")}
              </Button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-5 md:grid-rows-2 gap-1 h-auto md:h-[45vh]">
            {/* Large left image — spans both rows and first 2 cols */}
            <div className="relative rounded-md overflow-hidden bg-gray-100 min-h-[220px] md:min-h-0 md:col-span-2 md:row-span-2">
              {allImages[0] && (
                <Image
                  src={allImages[0]}
                  alt={t("hotelImageAlt", { index: 1 })}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Top row - col 3 */}
            <div className="relative rounded-md overflow-hidden bg-gray-100 min-h-[140px] md:min-h-0">
              {allImages[1] && (
                <Image
                  src={allImages[1]}
                  alt={t("hotelImageAlt", { index: 2 })}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Top row - col 4 */}
            <div className="relative rounded-md overflow-hidden bg-gray-100 min-h-[140px] md:min-h-0">
              {allImages[2] && (
                <Image
                  src={allImages[2]}
                  alt={t("hotelImageAlt", { index: 3 })}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Top row - col 5 with action icons */}
            <div className="relative rounded-md overflow-hidden bg-gray-100 min-h-[140px] md:min-h-0">
              {allImages[3] && (
                <Image
                  src={allImages[3]}
                  alt={t("hotelImageAlt", { index: 4 })}
                  fill
                  className="object-cover"
                />
              )}

              <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                <button
                  onClick={() => setFavorite(!isFavorite)}
                  className="bg-white/80 hover:bg-white p-2.5 rounded-full shadow transition-colors"
                  aria-label="Save to favorites"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </button>
                <button
                  className="bg-white/80 hover:bg-white p-2.5 rounded-full shadow transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Bottom row - col 3 */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 min-h-[140px] md:min-h-0">
              {allImages[4] && (
                <Image
                  src={allImages[4]}
                  alt={t("hotelImageAlt", { index: 5 })}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Bottom row - col 4 */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 min-h-[140px] md:min-h-0">
              {allImages[5] && (
                <Image
                  src={allImages[5]}
                  alt={t("hotelImageAlt", { index: 6 })}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            {/* Bottom row - col 5 with See All Photos */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 min-h-[140px] md:min-h-0">
              {allImages[6] && (
                <Image
                  src={allImages[6]}
                  alt={t("hotelImageAlt", { index: 7 })}
                  fill
                  className="object-cover"
                />
              )}

              <Button
                onClick={() => setOpen(true)}
                className="absolute bottom-0 left-0 right-0 top-0 z-10
                w-full h-full flex items-center justify-center
                 bg-black/60 text-white text-sm 
                 font-semibold flex-col gap-1 px-3 py-1.5 rounded-lg 
                  transition-colors"
              >
                <Images className="w-6 h-6" />
                <span className="text-sm font-semibold">
                  {t("seeAllPhotos", { count: allImages.length })}
                </span>
              </Button>
            </div>
          </div>

          {/* Amenities + Rating Section */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Highlights + Amenities Grid */}
            <div className="lg:col-span-2 space-y-4 border-e">
              {/* Travel Essentials row */}
              {facilities.length > 0 && (
                <>
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-xl">
                        <img
                          src="https://dimg04.tripcdn.com/images/1p11712000f0l584kFD8D.png"
                          alt="travel essentials"
                          width={20}
                          height={20}
                        />
                      </span>
                      <h4 className="font-bold text-xl">
                        {t("travelEssentials")}
                      </h4>
                    </div>
                    <div className="grid grid-cols-6 gap-x-5 gap-y-3">
                      {highlightFacilities.map((f: any, i: number) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-1.5 text-center w-24"
                        >
                          {f.facilityIcon ? (
                            <img
                              src={f.facilityIcon}
                              alt={f.facility || ""}
                              width={32}
                              height={32}
                              className="object-contain min-w-8 min-h-8 max-h-8 max-w-8"
                            />
                          ) : (
                            <CheckCircle className="w-7 h-7 text-gray-400" />
                          )}
                          <span
                            className=" text-gray-600  leading-tight text-nowrap line-clamp-1
                          text-ellipsis
                          whitespace-nowrap
                          max-w-full
                          max-h-full
                          "
                          >
                            {f.facility}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Amenities Grid */}
              <div className="mt-8">
                <h3 className="font-bold mb-5 text-xl">{t("amenities")}</h3>
                <div className="grid grid-cols-4 gap-6">
                  {amenitiesFacilities.map((f: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-2  text-gray-700 text-base"
                    >
                      {f.facilityIcon ? (
                        <img
                          src={f.facilityIcon}
                          alt=""
                          width={24}
                          height={24}
                          className="object-contain opacity-60 shrink-0 min-w-6 min-h-6 max-h-6 max-w-6"
                        />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                      <span className="text-gray-500  leading-tight font-normal">
                        {f.facility}
                      </span>
                    </div>
                  ))}
                </div>
                {!showAllAmenities && facilities.length > 8 && (
                  <button
                    onClick={() => setShowAllAmenities(true)}
                    className="mt-4 text-primary  font-medium hover:underline"
                  >
                    {t("allAmenities")}
                  </button>
                )}
              </div>
            </div>

            {/* Right: Rating + Surroundings */}
            <div className="space-y-3">
              {/* Rating Card */}
              <div className="">
                <div className="flex flex-col items-start gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8  min-w-[34px] items-center justify-center rounded-xl rounded-tr-none
                  bg-primary px-2 text-[16px] font-bold text-white shrink-0"
                    >
                      {ratingScore > 0 ? `${ratingScore.toFixed(1)}/10` : "N/A"}
                    </div>

                    <p className="font-bold text-primary text-xl">
                      {t(ratingLabelKey)}
                    </p>
                  </div>
                  <p className="text-base text-gray-600 mt-1 line-clamp-2">
                    {t("reviewQuote")}
                  </p>
                  <button className="text-primary text-base hover:underline mt-1.5 font-medium">
                    {t("allReviews", {
                      count: hotel?.reviews?.reviewsCount || 1522,
                    })}
                  </button>
                </div>
              </div>

              {/* Surroundings */}
              <div className="border-t rounded-lg py-4">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-16 h-9 rounded overflow-hidden bg-blue-50 border border-blue-100 shrink-0 flex items-center justify-center">
                    <FiMapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-xl">{t("surroundings")}</h4>
                </div>
                <div className="space-y-3 ">
                  {STATIC_SURROUNDINGS.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-base text-gray-700"
                    >
                      <item.Icon className="w-6 h-6 text-gray-500 shrink-0" />
                      <span className="flex-1 truncate text-base">
                        {item.label}
                      </span>
                      <span className="text-gray-500 shrink-0 text-base">
                        ({item.distance})
                      </span>
                    </div>
                  ))}
                </div>
                {onOpenMap &&
                hotel?.location?.latitude &&
                hotel?.location?.longitude ? (
                  <button
                    type="button"
                    onClick={onOpenMap}
                    className="mt-3 block text-left text-base font-medium text-primary hover:underline"
                  >
                    {t("viewOnMap")}
                  </button>
                ) : hotel?.location?.latitude && hotel?.location?.longitude ? (
                  <a
                    href={`https://maps.google.com/maps?q=${hotel.location.latitude},${hotel.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-base font-medium text-primary hover:underline"
                  >
                    {t("viewOnMap")}
                  </a>
                ) : (
                  <span className="mt-3 block text-base text-gray-400">
                    {t("viewOnMap")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Full Gallery Dialog */}
          <Dialog open={isOpen} onOpenChange={setOpen}>
            <DialogContent className="max-w-7xl md:min-w-[1000px] w-full max-h-[80vh] sm:max-h-[90vh] border-none overflow-hidden overflow-y-auto p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-200"
                  >
                    <Image
                      src={image}
                      alt={t("hotelImageAlt", { index: index + 1 })}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-lg" />
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </>
  );
}
