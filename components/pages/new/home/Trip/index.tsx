"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import {
  Bus,
  ChevronLeft,
  ChevronRight,
  BusFront,
  MoveRight,
} from "lucide-react";
import { useLocale } from "next-intl";

import Image1 from "@/public/images/new_hone/round1.webp";
import Image2 from "@/public/images/new_hone/round2.webp";
import Image3 from "@/public/images/new_hone/round3.webp";

import "swiper/css";
import "swiper/css/navigation";

type Props = Record<string, never>;

const navButtonClass =
  "absolute top-1/2 z-10 flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] sm:h-11 sm:w-11";

function Trip({}: Props) {
  const locale = useLocale();
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

  const rounds = [
    {
      id: 1,
      image: Image1,
      alt: "Shanghai",
    },
    {
      id: 2,
      image: Image2,
      alt: "Paris",
    },
    {
      id: 4,
      image: Image3,
      alt: "London",
    },
    {
      id: 3,
      image: Image1,
      alt: "Tokyo",
    },
    {
      id: 5,
      image: Image2,
      alt: "Beijing",
    },
    {
      id: 6,
      image: Image3,
      alt: "Tokyo",
    },
    {
      id: 7,
      image: Image1,
      alt: "Seoul",
    },
  ];

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-6 ">
      <h2 className="mb-4 text-[22px] font-bold leading-tight ">
        Get around in Shanghai
      </h2>

      <div className="relative min-w-0 max-w-full mx-2.5">
        <button
          id="hotels-top-prev"
          type="button"
          className={`${navButtonClass} ${showPrev ? "hidden sm:flex" : "hidden"} sm:start-2 translate-x-0 md:start-0 md:-translate-x-1/2`}
          aria-label="Previous Slide"
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
          className={`${navButtonClass} ${showNext ? "hidden sm:flex" : "hidden"} end-0 sm:end-2 translate-x-0 md:end-0 md:translate-x-1/2`}
          aria-label="Next Slide"
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
              slidesPerView: 5,
              spaceBetween: 16,
            },
          }}
        >
          {rounds.map((hotel, index) => (
            <SwiperSlide key={index} className="min-w-0 max-w-full h-full">
              <article
                className="group cursor-pointer rounded-lg border border-gray-300 h-full
               transition-all duration-300 group overflow-hidden"
              >
                {/* Image with rating badge */}
                <div className="relative overflow-hidden rounded-t-lg h-[110px] ">
                  <Image
                    src={hotel.image}
                    alt={hotel.alt}
                    className="h-[160px] w-full object-cover sm:h-[200px] group-hover:scale-105 transition-all duration-300"
                  />
                  {/* overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
                  <span className="text-white text-[20px] font-bold absolute bottom-0 left-1 right-0 p-2">
                    {hotel.alt}
                  </span>
                  <div className="absolute top-3 left-2 right-0 p-1 bg-white/70 w-fit py-0.5 text-[10px] rounded">
                    Mediun haul
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

export default Trip;
