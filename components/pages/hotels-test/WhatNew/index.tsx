"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import discoverImage1 from "@/public/images/flights/Discover1.png";
import discoverImage2 from "@/public/images/flights/Discover2.png";
import discoverImage3 from "@/public/images/flights/Discover3.png";

import "swiper/css";
import "swiper/css/navigation";

type Props = Record<string, never>;

const navButtonClass =
  "absolute top-1/2 z-10 hover:bg-primary hover:text-white flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] swiper-button-disabled:pointer-events-none swiper-button-disabled:opacity-0 sm:h-11 sm:w-11";

function WhatNew({}: Props) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const t = useTranslations("HotelsTestPage.WhatNew");

  const discoverBanners = [
    {
      id: 1,
      image: discoverImage1,
      alt: t("banner1Alt"),
      title: t("banner1Title"),
    },
    {
      id: 2,
      image: discoverImage2,
      alt: t("banner2Alt"),
      title: t("banner2Title"),
      description: t("banner2Description"),
    },
    {
      id: 3,
      image: discoverImage3,
      alt: t("banner3Alt"),
      title: t("banner3Title"),
      description: t("banner3Description"),
    },
    {
      id: 4,
      image: discoverImage1,
      alt: t("banner4Alt"),
      title: t("banner4Title"),
      description: t("banner4Description"),
    },
    {
      id: 5,
      image: discoverImage2,
      alt: t("banner5Alt"),
      title: t("banner5Title"),
      description: t("banner5Description"),
    },
    {
      id: 6,
      image: discoverImage3,
      alt: t("banner6Alt"),
      title: t("banner6Title"),
      description: t("banner6Description"),
    },
  ];

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-8 md:py-16">
      <h2 className="mb-4 text-[22px] font-bold leading-tight sm:text-[28px]">{t("title")}</h2>

      <div className="relative min-w-0 max-w-full sm:mx-5">
        <button
          id="hotels-what-new-prev"
          type="button"
          className={`${navButtonClass} hidden sm:flex sm:start-2 translate-x-0 md:start-0 md:-translate-x-1/2`}
          aria-label="Previous slide"
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
          className={`${navButtonClass} hidden sm:flex end-0 sm:end-2 translate-x-0 md:end-0 md:translate-x-1/2`}
          aria-label="Next slide"
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
          onResize={(swiper) => swiper.navigation?.update()}
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
              <article className="group relative cursor-pointer">
                <div className="overflow-hidden rounded-xl">
                  <Image
                    src={banner.image}
                    alt={banner.alt}
                    className="h-auto min-h-[200px] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110
              "
                  />
                </div>
                <h3 className="text-[14px] font-semibold leading-tight mt-2 ">
                  {banner.title}
                </h3>
                {"description" in banner && banner.description ? (
                  <p className="text-[14px] font-normal leading-tight  mt-1.5 text-black/50 ">
                    {banner.description}
                  </p>
                ) : null}
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default WhatNew;
