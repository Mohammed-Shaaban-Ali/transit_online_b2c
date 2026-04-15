"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

import hotelImage1 from "@/public/images/hotels/hotel1.webp";
import hotelImage2 from "@/public/images/hotels/hotel2.webp";
import hotelImage3 from "@/public/images/hotels/hotel3.webp";

import "swiper/css";
import "swiper/css/navigation";

type Props = Record<string, never>;

const navButtonClass =
  "absolute top-1/2 z-10 flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] sm:h-11 sm:w-11";

function Hotels({}: Props) {
  const locale = useLocale();
  const t = useTranslations("NewPage.home.hotels");
  const isRtl = locale === "ar";

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

  const hotels = [
    {
      id: 1,
      image: hotelImage1,
      alt: "Hotel 1",
      rating: 8.8,
      reviews: 2241,
      name: "MGM Shanghai West Bund",
      stars: 5,
      price: 72,
    },
    {
      id: 1,
      image: hotelImage2,
      alt: "Hotel 2",
      rating: 8.8,
      reviews: 2241,
      name: "Shanghai Marriott Hotel Hongqiao",
      stars: 5,
      price: 712,
    },
    {
      id: 3,
      image: hotelImage3,
      alt: "Hotel 3",
      rating: 8.8,
      reviews: 2241,
      name: "Shanghai Marriott Hotel Hongqiao",
      stars: 5,
      price: 712,
    },
    {
      id: 4,
      image: hotelImage1,
      alt: "Hotel 4",
      rating: 8.8,
      reviews: 2241,
      name: "Shanghai Marriott Hotel Hongqiao",
    },
    {
      id: 5,
      image: hotelImage2,
      alt: "Hotel 5",
      rating: 8.8,
      reviews: 2241,
      name: "Shanghai Marriott Hotel Hongqiao",
    },
    {
      id: 6,
      image: hotelImage3,
      alt: "Hotel 6",
      rating: 8.8,
      reviews: 2241,
      name: "Shanghai Marriott Hotel Hongqiao",
    },
  ];

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-6 ">
      <h2 className="mb-4 text-[22px] font-bold leading-tight ">
        {t("title")}
      </h2>

      <div className="relative min-w-0 max-w-full mx-2.5">
        <button
          id="hotels-top-prev"
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
          id="hotels-top-next"
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
          {hotels.map((hotel, index) => (
            <SwiperSlide key={index} className="min-w-0 max-w-full h-full">
              <article
                className="group cursor-pointer rounded-lg border border-gray-300 h-full
               transition-all duration-300 group overflow-hidden"
              >
                {/* Image with rating badge */}
                <div className="relative overflow-hidden rounded-t-lg h-[160px] sm:h-[200px]">
                  <Image
                    src={hotel.image}
                    alt={hotel.alt}
                    className="h-[160px] w-full object-cover sm:h-[200px] group-hover:scale-105 transition-all duration-300"
                  />
                </div>

                {/* Card body */}
                <div className="flex flex-col p-3.5 pt-4 gap-1">
                  {/* Hotel name */}
                  <span className="text-[12px] font-normal text-black/50">
                    {t("city")}
                  </span>
                  <h3 className="text-[16px] font-medium leading-tight text-black/90 line-clamp-1">
                    {hotel.name}
                  </h3>

                  {/* Rating badge */}
                  <div className="mt-2 flex items-center overflow-hidden rounded-full   bg-white h-5 z-10">
                    <span
                      className="flex items-center gap-0.5 bg-primary px-1.5  text-xs
                     font-semibold text-white rounded-br-md h-full"
                    >
                      <span>{hotel.rating}</span>
                      <span className="font-normal opacity-80">/10</span>
                    </span>
                    <span className="bg-white px-2 py-0.5 text-xs font-medium text-black/70">
                      {t("reviews", { count: hotel.reviews.toLocaleString() })}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mt-6 flex items-baseline  gap-1">
                    <span className="text-[14px] font-medium text-black">
                      {t("from")}
                    </span>
                    <span className="text-[16px] font-semibold text-black">
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

export default Hotels;
