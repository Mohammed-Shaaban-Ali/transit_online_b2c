"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import hotelImage1 from "@/public/images/hotels/hotel1.webp";
import hotelImage2 from "@/public/images/hotels/hotel2.webp";
import hotelImage3 from "@/public/images/hotels/hotel3.webp";

import "swiper/css";
import "swiper/css/navigation";

type Props = Record<string, never>;

const navButtonClass =
  "absolute top-1/2 z-10 hover:bg-primary hover:text-white flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] swiper-button-disabled:pointer-events-none swiper-button-disabled:opacity-0 sm:h-11 sm:w-11";


function TopHotels({ title }: { title: string }) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("HotelsTestPage.TopHotels");

  const hotels = [
    {
      id: 1,
      image: hotelImage1,
      alt: t("hotel1Alt"),
      rating: 8.8,
      reviews: 2241,
      name: t("hotel1Name"),
      subName: "81",
      stars: 5,
      address: t("hotel1Address"),
      distance: t("fromCityCenter", { distance: t("hotel1Distance") }),
      price: 72,
    },
    {
      id: 2,
      image: hotelImage2,
      alt: t("hotel2Alt"),
      rating: 8.4,
      reviews: 10081,
      name: t("hotel2Name"),
      subName: null,
      stars: 5,
      address: t("hotel2Address"),
      distance: t("fromCityCenter", { distance: t("hotel2Distance") }),
      price: 118,
    },
    {
      id: 3,
      image: hotelImage3,
      alt: t("hotel3Alt"),
      rating: 8.2,
      reviews: 1492,
      name: t("hotel3Name"),
      subName: null,
      stars: 4,
      address: t("hotel3Address"),
      distance: t("fromCityCenter", { distance: t("hotel3Distance") }),
      price: 35,
    },
    {
      id: 4,
      image: hotelImage1,
      alt: t("hotel4Alt"),
      rating: 8.5,
      reviews: 4227,
      name: t("hotel4Name"),
      subName: null,
      stars: 5,
      address: t("hotel4Address"),
      distance: t("fromCityCenter", { distance: t("hotel4Distance") }),
      price: 30,
    },
    {
      id: 5,
      image: hotelImage2,
      alt: t("hotel5Alt"),
      rating: 9.0,
      reviews: 3150,
      name: t("hotel5Name"),
      subName: null,
      stars: 5,
      address: t("hotel5Address"),
      distance: t("fromCityCenter", { distance: t("hotel5Distance") }),
      price: 95,
    },
    {
      id: 6,
      image: hotelImage3,
      alt: t("hotel6Alt"),
      rating: 8.7,
      reviews: 5600,
      name: t("hotel6Name"),
      subName: null,
      stars: 4,
      address: t("hotel6Address"),
      distance: t("fromCityCenter", { distance: t("hotel6Distance") }),
      price: 55,
    },
  ];

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-6 md:py-10">
      <h2 className="mb-4 text-[22px] font-bold leading-tight sm:text-[28px]">{title}</h2>

      <div className="relative min-w-0 max-w-full sm:mx-5">
        <button
          id="hotels-top-prev"
          type="button"
          className={`${navButtonClass} hidden sm:flex sm:start-2 translate-x-0 md:start-0 md:-translate-x-1/2`}
          aria-label={t("previousSlide")}
        >
          <ChevronLeft
            className="h-5 w-5 rtl:rotate-180"
            strokeWidth={2.25}
            aria-hidden
          />
        </button>
        <button
          id="hotels-top-next"
          type="button"
          className={`${navButtonClass} hidden sm:flex end-0 sm:end-2 translate-x-0 md:end-0 md:translate-x-1/2`}
          aria-label={t("nextSlide")}
        >
          <ChevronRight
            className="h-5 w-5 rtl:rotate-180"
            strokeWidth={2.25}
            aria-hidden
          />
        </button>

        <Swiper
          modules={[Navigation]}
          dir={isRtl ? "rtl" : "ltr"}
          navigation={{
            prevEl: "#hotels-top-prev",
            nextEl: "#hotels-top-next",
          }}
          watchOverflow
          className="min-w-0 max-w-full"
          spaceBetween={12}
          slidesPerView={1}
          onResize={(swiper) => swiper.navigation?.update()}
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
          {hotels.map((hotel) => (
            <SwiperSlide key={hotel.id} className="min-w-0 max-w-full h-full">
              <article
                className="group cursor-pointer rounded-lg border border-gray-300 h-full
               transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                {/* Image with rating badge */}
                <div className="relative ">
                  <Image
                    src={hotel.image}
                    alt={hotel.alt}
                    className="h-[160px] w-full object-cover sm:h-[190px]"
                  />

                  {/* Rating badge */}
                  <div className="absolute -bottom-3.5 start-5 flex items-center overflow-hidden rounded-full border-2 border-primary bg-white h-7 z-10">
                    <span className="flex items-center gap-0.5 bg-primary px-3.5 py-1 text-xs font-semibold text-white rounded-br-full h-full">
                      <span>{hotel.rating}</span>
                      <span className="font-normal opacity-80">/10</span>
                    </span>
                    <span className="bg-white px-2.5 py-1 text-xs font-medium text-black/70">
                      {t("reviews", { count: hotel.reviews.toLocaleString() })}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col p-3.5 pt-7">
                  {/* Hotel name */}
                  <h3 className="text-[16px] font-semibold leading-tight text-black/90 line-clamp-1">
                    {hotel.name}
                  </h3>

                  {/* Address */}
                  <p className="mt-1 text-[14px] leading-snug text-black/50 line-clamp-2 font-normal">
                    {hotel.address} | {hotel.distance}
                  </p>

                  {/* Price */}
                  <div className="mt-3 flex items-baseline justify-end gap-1">
                    <span className="text-[12px] text-black/50 font-normal">
                      {t("from")}
                    </span>
                    <span className="text-[16px] font-semibold text-black/90">
                      US${hotel.price}
                    </span>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default TopHotels;
