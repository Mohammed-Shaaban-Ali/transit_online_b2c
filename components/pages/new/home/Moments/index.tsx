"use client";

import { useCallback, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { BadgeCheck, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

import hotelImage1 from "@/public/images/hotels/hotel1.webp";
import hotelImage2 from "@/public/images/hotels/hotel2.webp";
import hotelImage3 from "@/public/images/hotels/hotel3.webp";
import avatar1 from "@/public/images/new_hone/round1.webp";
import avatar2 from "@/public/images/new_hone/round2.webp";
import avatar3 from "@/public/images/new_hone/round3.webp";

import "swiper/css";
import "swiper/css/navigation";

type Props = Record<string, never>;

type Moment = {
  id: number;
  image: StaticImageData;
  alt: string;
  title: string;
  username: string;
  avatar: StaticImageData;
  verified?: boolean;
};

const navButtonClass =
  "absolute top-1/2 z-10 flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] sm:h-11 sm:w-11";

const moments: Moment[] = [
  {
    id: 1,
    image: hotelImage1,
    alt: "Shanghai skyline travel moment",
    title:
      "Shanghai Travel Guide | Essential Practical Guide to Exploring the City",
    username: "Jennifer890_Morgan",
    avatar: avatar1,
  },
  {
    id: 2,
    image: hotelImage2,
    alt: "China travel calendar infographic",
    title: "Planning a gita to China? Save this travel calendar! 🗓️",
    username: "TripGenie",
    avatar: avatar2,
    verified: true,
  },
  {
    id: 3,
    image: hotelImage3,
    alt: "Spa relaxation in Shanghai",
    title: "24 Hours of Pure Relaxation: Solo Adventure in Shanghai",
    username: "Crazy.traveler",
    avatar: avatar3,
  },
  {
    id: 4,
    image: hotelImage1,
    alt: "Blue lake landscape near Shanghai",
    title: "Shanghai has its own secret Blue Lake paradise",
    username: "Trip.Pulse",
    avatar: avatar1,
  },
  {
    id: 5,
    image: hotelImage2,
    alt: "City lights at night",
    title: "Night walks along the Bund — best photo spots",
    username: "UrbanLens",
    avatar: avatar2,
  },
  {
    id: 6,
    image: hotelImage3,
    alt: "Street food tour",
    title: "Hidden alley food gems locals actually eat",
    username: "FoodieSh",
    avatar: avatar3,
  },
];

function Moments({}: Props) {
  const locale = useLocale();
  const t = useTranslations("NewPage.home.moments");
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

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-6 ">
      <h2 className="mb-4 text-[22px] font-bold leading-tight ">
        {t("title")}
      </h2>

      <div className="relative min-w-0 max-w-full mx-2.5">
        <button
          id="moments-carousel-prev"
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
          id="moments-carousel-next"
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
            prevEl: "#moments-carousel-prev",
            nextEl: "#moments-carousel-next",
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
          {moments.map((moment) => (
            <SwiperSlide key={moment.id} className="min-w-0 max-w-full h-auto">
              <article
                className="group relative aspect-3/4 w-full cursor-pointer overflow-hidden rounded-lg
               shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <Image
                  src={moment.image}
                  alt={moment.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent"
                  aria-hidden
                />

                <button
                  type="button"
                  className="absolute end-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-black backdrop-blur-[2px] transition-colors hover:bg-white/70"
                  aria-label={t("like")}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart
                    className="h-[18px] w-[18px]"
                    strokeWidth={2}
                    aria-hidden
                  />
                </button>

                <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-3.5">
                  <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-white sm:text-base">
                    {moment.title}
                  </h3>
                  <div className="mt-2 flex min-w-0 items-center gap-2">
                    <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full ring-2 ring-white/30">
                      <Image
                        src={moment.avatar}
                        alt=""
                        width={24}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="min-w-0 truncate text-[13px] text-white/95">
                      {moment.username}
                    </span>
                    {moment.verified ? (
                      <BadgeCheck
                        className="h-4 w-4 shrink-0 text-sky-400"
                        aria-label={t("verified")}
                        strokeWidth={2.25}
                      />
                    ) : null}
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

export default Moments;
