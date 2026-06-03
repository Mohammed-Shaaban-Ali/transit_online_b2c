"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import { useGetFlightOffersQuery } from "@/redux/features/website/websiteApi";
import { IFlightOffer } from "@/types/website";
import { buildFlightSearchUrl } from "@/utils/buildFlightSearchUrl";

import "swiper/css";
import "swiper/css/navigation";
import { Link } from "@/i18n/navigation";

type Props = Record<string, never>;

const navButtonClass =
  "absolute top-1/2 z-10 flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] sm:h-11 sm:w-11";

const formatOfferDateRange = (
  departureDate: string,
  returnDate: string,
  locale: string,
) => {
  const dateLocale = locale === "ar" ? ar : enUS;
  const departure = format(parseISO(departureDate), "d MMMM", {
    locale: dateLocale,
  });
  const returnDay = format(parseISO(returnDate), "d MMMM", {
    locale: dateLocale,
  });
  return `${departure} - ${returnDay}`;
};

function FlightsOffers({}: Props) {
  const locale = useLocale();
  const t = useTranslations("NewPage.home.round");
  const isRtl = locale === "ar";
  const { data, isLoading } = useGetFlightOffersQuery({});

  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(false);

  const syncNavVisibility = useCallback((swiper: SwiperType) => {
    if (swiper.isLocked) {
      setShowPrev(false);
      setShowNext(false);
      return;
    }
    setShowPrev(!swiper.isBeginning);
    setShowNext(!swiper.isEnd);
  }, []);

  const visibleOffers = useMemo(() => data?.data?.slice(0, 8) ?? [], [data]);
  if (!isLoading && visibleOffers.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-bold leading-tight">
          {isRtl ? "الوجهات الأكثر سفراً" : "Most Traveled Destinations"}
        </h2>
        <Link
          href="/flights-offers"
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("viewMore")}
        </Link>
      </div>

      <div className="relative mx-2.5 min-w-0 max-w-full">
        <button
          id="flights-offers-top-prev"
          type="button"
          className={`${navButtonClass} ${showPrev ? "hidden sm:flex" : "hidden"}
             sm:start-2 translate-x-0 md:start-0 md:-translate-x-1/2
             md:rtl:start-0 md:rtl:translate-x-1/2`}
          aria-label={t("previousSlide")}
        >
          <ChevronLeft
            className="h-5 w-5 rtl:rotate-180"
            strokeWidth={2.25}
            aria-hidden
          />
        </button>
        <button
          id="flights-offers-top-next"
          type="button"
          className={`${navButtonClass} ${showNext ? "hidden sm:flex" : "hidden"}
             end-0 sm:end-2 translate-x-0 md:end-0 md:translate-x-1/2
             md:rtl:end-0 md:rtl:-translate-x-1/2`}
          aria-label={t("nextSlide")}
        >
          <ChevronRight
            className="h-5 w-5 rtl:rotate-180"
            strokeWidth={2.25}
            aria-hidden
          />
        </button>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <FlightOfferCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation]}
            dir={isRtl ? "rtl" : "ltr"}
            navigation={{
              prevEl: "#flights-offers-top-prev",
              nextEl: "#flights-offers-top-next",
            }}
            watchOverflow
            className="min-w-0 max-w-full"
            spaceBetween={12}
            slidesPerView={1.5}
            onSwiper={syncNavVisibility}
            onSlideChange={syncNavVisibility}
            onBreakpoint={syncNavVisibility}
            onResize={(swiper) => {
              swiper.navigation?.update();
              syncNavVisibility(swiper);
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 14,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
            }}
          >
            {visibleOffers.map((offer) => (
              <SwiperSlide key={offer.id} className="h-full min-w-0 max-w-full">
                <FlightOfferCard offer={offer} locale={locale} isRtl={isRtl} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default FlightsOffers;

export const FlightOfferCard = ({
  offer,
  locale,
  isRtl,
}: {
  offer: IFlightOffer;
  locale: string;
  isRtl: boolean;
}) => {
  const dateRange = formatOfferDateRange(
    offer.departure_date,
    offer.return_date,
    locale,
  );

  const searchHref = buildFlightSearchUrl({
    fromAirport: offer.from_airport,
    toAirport: offer.to_airport,
    departureDate: offer.departure_date,
    returnDate: offer.return_date,
  });

  return (
    <Link
      href={searchHref}
      className="group flex h-full flex-col justify-between rounded-xl border border-gray-200 bg-white p-2.5 transition-all duration-300 hover:border-primary/40"
    >
      <div className="overflow-hidden">
        <div className="relative h-[140px] overflow-hidden rounded-lg md:h-[160px]">
          <Image
            src={offer.image}
            alt={offer.title}
            width={600}
            height={300}
            className="h-[140px] w-full object-cover transition-all duration-300 group-hover:scale-105 md:h-[160px]"
          />
        </div>

        <div className="flex flex-col items-center gap-1.5 pt-3.5 text-center">
          <h3 className="text-16 line-clamp-1 font-semibold leading-tight text-black">
            {offer.title}
          </h3>
          <p className="text-sm font-medium text-gray-500">{dateRange}</p>
          <p className="text-sm font-bold text-primary">
            {isRtl ? "ابتداءً من" : "Starting from"}{" "}
            <span>
              {offer.price} {offer.currency}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export const FlightOfferCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg border border-gray-300 p-2.5">
      <div className="h-[140px] rounded-lg bg-gray-200 sm:h-[160px]" />
      <div className="flex flex-col items-center gap-2 pt-3.5">
        <div className="h-4 w-4/5 rounded bg-gray-200" />
        <div className="h-3 w-3/5 rounded bg-gray-200" />
        <div className="h-4 w-2/5 rounded bg-gray-200" />
      </div>
    </div>
  );
};
