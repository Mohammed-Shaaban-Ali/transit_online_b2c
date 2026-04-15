"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";

import discoverImage1 from "@/public/images/flights/Discover1.png";
import discoverImage2 from "@/public/images/flights/Discover2.png";
import discoverImage3 from "@/public/images/flights/Discover3.png";

import "swiper/css";
import "swiper/css/navigation";

type Props = Record<string, never>;

const navButtonClass =
  "absolute top-1/2 z-10 flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] sm:h-11 sm:w-11";

function Discover({}: Props) {
  const locale = useLocale();
  const t = useTranslations("NewPage.home.discover");
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

  const discoverBanners = [
    {
      id: 1,
      image: discoverImage1,
      alt: "Discover 1",
    },
    {
      id: 2,
      image: discoverImage2,
      alt: "Discover 2",
    },
    {
      id: 3,
      image: discoverImage3,
      alt: "Discover 3",
    },
    {
      id: 4,
      image: discoverImage1,
      alt: "Discover 4",
    },
    {
      id: 5,
      image: discoverImage2,
      alt: "Discover 5",
    },
    {
      id: 6,
      image: discoverImage3,
      alt: "Discover 6",
    },
  ];

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-8 md:py-16">
      <div className="relative min-w-0 max-w-full sm:mx-5">
        <button
          id="hotels-what-new-prev"
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
          id="hotels-what-new-next"
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
            prevEl: "#hotels-what-new-prev",
            nextEl: "#hotels-what-new-next",
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
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
        >
          {discoverBanners.map((banner) => (
            <SwiperSlide key={banner.id} className="min-w-0 max-w-full">
              <div className="overflow-hidden rounded-xl">
                <Image
                  src={banner.image}
                  alt={banner.alt}
                  className="h-auto min-h-[200px]  w-full object-cover transition-transform duration-500 
                  ease-out hover:scale-105 rounded-xl 
              "
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Discover;
