"use client";

import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import OfferCard from "./OfferCard";
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FlightOffer } from "@/types/fareTypes";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";

interface OfferSelectionProps {
  offers: FlightOffer[];
  selectedOfferKey?: string;
  selectedDepartureOffer?: string | null;
  showReturnOffers?: boolean;
  showDepartureOffers?: boolean;
  onDepartureSelect?: (departureName: string) => void;
  onOfferSelect: (offerKey: string) => void;
  onBackToDeparture: () => void;
}

const OfferSelection: React.FC<OfferSelectionProps> = ({
  offers,
  selectedOfferKey,
  selectedDepartureOffer: externalSelectedDeparture,
  showReturnOffers: externalShowReturnOffers,
  showDepartureOffers: externalShowDepartureOffers = true,
  onDepartureSelect: externalOnDepartureSelect,
  onOfferSelect,
  onBackToDeparture,
}) => {
  const t = useTranslations("FlightDetails");
  const swiperRef = useRef<any>(null);
  const returnSwiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [returnIsBeginning, setReturnIsBeginning] = useState(true);
  const [returnIsEnd, setReturnIsEnd] = useState(false);

  const [internalSelectedDeparture, setInternalSelectedDeparture] = useState<
    string | null
  >(null);

  // Use external state if provided, otherwise use internal state
  const selectedDepartureName =
    externalSelectedDeparture !== undefined
      ? externalSelectedDeparture
      : internalSelectedDeparture;
  const showReturnOffers =
    externalShowReturnOffers !== undefined
      ? externalShowReturnOffers
      : !!selectedDepartureName;

  // Get departure offers (unique by name)
  const departureOffers = React.useMemo(() => {
    const seen = new Set<string>();
    return offers.filter((offer) => {
      const name = offer.offer_details[0]?.name;
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }, [offers]);

  // Get return offers that match selected departure
  const returnOffers = React.useMemo(() => {
    if (!selectedDepartureName) return [];
    return offers.filter(
      (offer) => offer.offer_details[0]?.name == selectedDepartureName
    );
  }, [offers, selectedDepartureName]);

  // Handle departure selection
  const handleDepartureSelect = (departureName: string) => {
    if (externalOnDepartureSelect) {
      externalOnDepartureSelect(departureName);
    } else {
      setInternalSelectedDeparture(departureName);
    }
    // Reset return swiper to beginning
    if (returnSwiperRef.current && returnSwiperRef.current.swiper) {
      returnSwiperRef.current.swiper.slideTo(0);
    }
  };

  // Handle return offer selection
  const handleReturnSelect = (offerKey: string) => {
    onOfferSelect(offerKey);
  };
  return (
    <div className="">
      {/* Departure Flights Section */}
      {externalShowDepartureOffers && (
        <div className="relative ">
          <div className="flex items-center justify-between mb-4 gap-2.5 ">
            {/* Title - Top Right */}
            <h3 className="text-lg font-bold line-clamp-1">
              {t("chooseDepartureTravelPackage")}
            </h3>

            {/* Departure Navigation Buttons - Top Left */}
            <div className=" flex gap-2">
              <Button
                variant={isBeginning ? "outline-primary" : "default"}
                size="icon"
                className="rounded-full "
                disabled={isBeginning}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  swiperRef.current?.swiper?.slidePrev();
                }}
              >
                <FaChevronLeft size={12} className="rtl:rotate-180" />
              </Button>

              <Button
                variant={isEnd ? "outline-primary" : "default"}
                size="icon"
                className="rounded-full"
                disabled={isEnd}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  swiperRef.current?.swiper?.slideNext();
                }}
              >
                <FaChevronRight size={12} className="rtl:rotate-180" />
              </Button>
            </div>
          </div>

          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={"auto"}
            slidesPerGroup={1}
            speed={300}
            freeMode={false}
            centeredSlides={false}
            navigation={{
              prevEl: ".swiper-button-prev-departure",
              nextEl: ".swiper-button-next-departure",
            }}
            pagination={{
              el: ".swiper-pagination-departure",
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            breakpoints={{
              480: { spaceBetween: 16 },
              768: { spaceBetween: 20 },
              1200: { spaceBetween: 24 },
            }}
            watchSlidesProgress={true}
            className="offer-swiper pb-4"
            onSwiper={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setIsBeginning(swiper.isBeginning);
              setIsEnd(swiper.isEnd);
            }}
          >
            {departureOffers.map((offer, index) => {
              // const badge = getDepartureBadge(offer, index);
              const isSelected =
                selectedDepartureName === offer.offer_details[0]?.name;
              // const priceDifference =
              //   offer.minimum_offer_price - cheapestDeparturePrice;

              return (
                <SwiperSlide
                  key={offer.offer_key}
                  className="h-auto flex mt-4"
                  style={{ width: "300px" }}
                >
                  <OfferCard
                    offer={offer}
                    isSelected={isSelected}
                    onSelect={() =>
                      handleDepartureSelect(offer.offer_details[0]?.name || "")
                    }
                    displayPrice={formatePrice(offer.minimum_offer_price || 0)}
                    isReturnPhase={false}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* Return Flights Section */}
      {selectedDepartureName && showReturnOffers && returnOffers.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4 gap-2.5 ">
            {/* Title - Top Right */}
            <h3 className="text-lg font-bold line-clamp-1">
              {t("chooseReturnTravelPackage")}
            </h3>

            {/* Departure Navigation Buttons - Top Left */}
            <div className=" flex gap-2">
              <Button
                variant={returnIsBeginning ? "outline-primary" : "default"}
                size="icon"
                className="rounded-full "
                disabled={returnIsBeginning}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  returnSwiperRef.current?.swiper?.slidePrev();
                }}
              >
                <FaChevronLeft size={12} className="rtl:rotate-180" />
              </Button>

              <Button
                variant={returnIsEnd ? "outline-primary" : "default"}
                size="icon"
                className="rounded-full"
                disabled={returnIsEnd}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  returnSwiperRef.current?.swiper?.slideNext();
                }}
              >
                <FaChevronRight size={12} className="rtl:rotate-180" />
              </Button>
            </div>
          </div>

          <Swiper
            ref={returnSwiperRef}
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={"auto"}
            slidesPerGroup={1}
            speed={300}
            freeMode={false}
            centeredSlides={false}
            navigation={{
              prevEl: ".swiper-button-prev-return",
              nextEl: ".swiper-button-next-return",
            }}
            pagination={{
              el: ".swiper-pagination-return",
              clickable: true,
              bulletClass: "swiper-pagination-bullet",
              bulletActiveClass: "swiper-pagination-bullet-active",
            }}
            breakpoints={{
              480: { spaceBetween: 16 },
              768: { spaceBetween: 20 },
              1200: { spaceBetween: 24 },
            }}
            watchSlidesProgress={true}
            dir="ltr"
            className="offer-swiper pb-4"
            onSwiper={(swiper) => {
              setReturnIsBeginning(swiper.isBeginning);
              setReturnIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
              setReturnIsBeginning(swiper.isBeginning);
              setReturnIsEnd(swiper.isEnd);
            }}
          >
            {returnOffers.map((offer, index) => {
              // const badge = getReturnBadge(offer, index);
              const returnOfferName = offer.offer_details[1]?.name;
              const isSelected = selectedOfferKey === returnOfferName;
              const returnPrice = offer.total_price - offer.minimum_offer_price;
              // const priceDifference = returnPrice - cheapestReturnPrice;
              return (
                <SwiperSlide
                  key={offer.offer_key}
                  className="h-auto flex mt-4"
                  style={{ width: "300px" }}
                >
                  <OfferCard
                    offer={offer}
                    isSelected={isSelected}
                    onSelect={() => handleReturnSelect(returnOfferName || "")}
                    displayPrice={`${formatePrice(returnPrice || 0)}+`}
                    isReturnPhase={true}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default OfferSelection;
