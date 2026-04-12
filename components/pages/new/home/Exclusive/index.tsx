"use client";

import { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Navigation } from "swiper/modules";
import type { LucideIcon } from "lucide-react";
import {
  Bed,
  ChevronLeft,
  ChevronRight,
  FerrisWheel,
  Info,
  Plane,
  TrainFront,
} from "lucide-react";
import { useLocale } from "next-intl";

import "swiper/css";
import "swiper/css/navigation";

type Props = Record<string, never>;

const navButtonClass =
  "absolute top-1/2 z-10 flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-opacity hover:bg-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] sm:h-11 sm:w-11";

type Coupon = {
  id: number;
  discount: string;
  category: string;
  Icon: LucideIcon;
};

const coupons: Coupon[] = [
  { id: 1, discount: "10% off", category: "Hotels & Homes", Icon: Bed },
  { id: 2, discount: "5% off", category: "EU trains", Icon: TrainFront },
  { id: 3, discount: "8% off", category: "Attractions", Icon: FerrisWheel },
  { id: 4, discount: "12% off", category: "Airport transfers", Icon: Plane },
  { id: 5, discount: "15% off", category: "Hotels & Homes", Icon: Bed },
  { id: 6, discount: "18% off", category: "EU trains", Icon: TrainFront },
  { id: 7, discount: "20% off", category: "Attractions", Icon: FerrisWheel },
  { id: 8, discount: "22% off", category: "Airport transfers", Icon: Plane },
];

function Exclusive({}: Props) {
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

  return (
    <section className="container mx-auto w-full min-w-0 max-w-[1200px]! overflow-x-clip py-6 pb-1">
      <h2 className="mb-4 text-[24px] font-bold leading-tight">
        New user exclusive
      </h2>

      <div
        className={`relative min-w-0 max-w-full mx-2.5 rounded-xl px-1 py-2 sm:px-2 `}
      >
        <button
          id="exclusive-prev"
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
          id="exclusive-next"
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
            prevEl: "#exclusive-prev",
            nextEl: "#exclusive-next",
          }}
          watchOverflow
          className="min-w-0 max-w-full py-1"
          spaceBetween={12}
          slidesPerView={1.15}
          onSwiper={syncNavVisibility}
          onSlideChange={syncNavVisibility}
          onBreakpoint={syncNavVisibility}
          onResize={(swiper) => {
            swiper.navigation?.update();
            syncNavVisibility(swiper);
          }}
          breakpoints={{
            480: {
              slidesPerView: 1.35,
              spaceBetween: 12,
            },
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
          {coupons.map(({ id, discount, category, Icon }) => (
            <SwiperSlide key={id} className="min-w-0 max-w-full h-full">
              <article
                className={`group relative flex h-full min-h-[148px]  rounded-xl border border-[#f8bbd0] bg-white shadow-[0_2px_14px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] ${isRtl ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Main body */}
                <div className="flex min-w-0 flex-3 flex-col  gap-1 p-3.5 sm:p-4">
                  <p className="text-[22px] font-bold leading-tight tracking-tight text-neutral-900 ">
                    {discount}
                  </p>
                  <div className="flex items-center gap-1.5 text-[16px] font-medium text-neutral-900">
                    <span className="truncate">{category}</span>
                    <button
                      type="button"
                      className="inline-flex shrink-0 rounded-full text-neutral-400 transition-colors hover:text-neutral-600"
                      aria-label={`More about ${category}`}
                    >
                      <Info className="h-4 w-4" strokeWidth={2} aria-hidden />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="w-fit rounded-sm bg-primary px-3.5 py-2 text-sm mt-auto
                     font-semibold text-white transition-colors hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Claim all
                  </button>
                </div>

                {/* Divider + perforation notches */}
                <div className="relative w-0 shrink-0" aria-hidden>
                  <div
                    className={`absolute top-1/2 left-1/2 h-[calc(100%-20px)] w-0 
                        
                                -translate-x-1/2 -translate-y-1/2 border-s border-dashed border-[#f8bbd0]`}
                  />
                  <div
                    className={`absolute top-0 left-1/2 z-1 h-5 w-5 -translate-x-1/2 -translate-y-1/2 
                        bg-white
                        rounded-full shadow-[0_0_0_1px_rgba(248,187,208)]`}
                  />
                  <div
                    className={`absolute bottom-0 left-1/2 z-1 h-5 w-5 -translate-x-1/2 translate-y-1/2 
                                bg-white
                                rounded-full shadow-[0_0_0_1px_rgba(248,187,208)]`}
                  />
                </div>

                {/* Stub */}
                <div className="flex w-[26%] min-w-[68px] max-w-[100px] shrink-0 items-center justify-center px-2">
                  <Icon
                    className="size-9 text-[#D81B60] sm:h-11 sm:w-11"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Exclusive;
