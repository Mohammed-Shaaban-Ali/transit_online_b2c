"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useGetFeaturedDestinationsQuery } from "@/redux/features/website/websiteApi";

import "swiper/css";
import "swiper/css/navigation";

type Props = Record<string, never>;

const navButtonClass =
  "absolute top-1/2 z-10 flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] sm:h-11 sm:w-11";

function FeaturedDestinations({}: Props) {
  const locale = useLocale();
  const t = useTranslations("NewPage.home.round");
  const isRtl = locale === "ar";
  const { data, isLoading } = useGetFeaturedDestinationsQuery({});

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

  const visiblePosts = useMemo(() => data?.data.slice(0, 8) ?? [], [data]);

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-6 ">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[22px] font-bold leading-tight ">
          {isRtl ? "واجهات مميزه" : "Featured Destinations"}
        </h2>
        <Link
          href="/featured-destinations"
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("viewMore")}
        </Link>
      </div>

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

        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-300 p-2 animate-pulse"
              >
                <div className="h-[140px] rounded-lg bg-gray-200 sm:h-[160px]" />
                <div className="pt-2.5">
                  <div className="h-4 w-4/5 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : (
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
            {visiblePosts.map((post) => {
              const imageUrl = `https://gita.sa/storage/${post.featured_image}`;

              return (
                <SwiperSlide
                  key={post.id}
                  className="min-w-0 max-w-full h-full"
                >
                  <article
                    className="group rounded-lg border border-gray-300 h-full
               transition-all duration-300 overflow-hidden p-2"
                  >
                    <div className="relative overflow-hidden rounded-lg h-[140px] sm:h-[160px]">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        width={600}
                        height={300}
                        className="h-[160px] w-full object-cover sm:h-[200px] group-hover:scale-105 transition-all duration-300"
                      />
                    </div>

                    <div className="flex flex-col pt-2.5 gap-1">
                      <h3 className="text-[16px] font-semibold leading-tight text-black line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </section>
  );
}

export default FeaturedDestinations;
