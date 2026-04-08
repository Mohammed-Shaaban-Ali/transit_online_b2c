"use client";

import { useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Ticket,
  TicketPercent,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Button } from "@/components/ui/button";

type Props = {};

function FirstBooking({}: Props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const offers = [
    {
      id: 1,
      icon: Ticket,
      title: "Up to US$10 off",
      subtitle: "New user promo code",
    },
    {
      id: 2,
      icon: Ticket,
      title: "Up to US$6 off",
      subtitle: "New user promo code",
    },
    {
      id: 3,
      icon: TicketPercent,
      title: "Up to 20% off",
      subtitle: "First Booking Deal",
    },
    {
      id: 4,
      icon: TicketPercent,
      title: "Up to 20% off",
      subtitle: "First Booking Deal",
    },
    {
      id: 5,
      icon: TicketPercent,
      title: "Up to 20% off",
      subtitle: "First Booking Deal",
    },
  ];

  const goToSlide = (index: number) => {
    const swiper = swiperRef.current;
    if (!swiper) return;

    const safeIndex = (index + offers.length) % offers.length;
    swiper.slideToLoop(safeIndex);
    setActiveIndex(safeIndex);
  };

  return (
    <div className="mb-5 rounded-lg border border-gray-300 bg-white px-4 py-3 relative overflow-hidden">
      {/* bg blur */}
      <div
        className="pointer-events-none absolute -top-4 left-0 h-5 w-52 rounded-full
       bg-linear-to-r from-[#ff4fa0]/70 to-[#ff4fa0]/30 blur-3xl"
      />

      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-[14px] leading-5">
          <span className="font-bold text-black">
            First booking offer! Enjoy{" "}
            <span className="text-[#ff0a78]">10% </span> off stays!
          </span>
          <span className="flex items-center gap-0.5 text-gray-500 text-[12px]">
            <Check size={12} className="text-green-500" />
            We&apos;ll apply the best discount for you at check-out
          </span>
        </div>

        <Button
          type="button"
          size="sm"
          className="h-9 text-[14px] px-4 rounded font-normal"
        >
          Claim All
        </Button>
      </div>

      <div className="flex items-center relative">
        <div className="h-full w-20 bg-linear-to-r from-white to-white/30 z-2 absolute top-0 left-0"></div>
        <button
          type="button"
          className="
          absolute top-1/2 left-4 -translate-y-1/2 z-10
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#1a1e2b]"
          aria-label="Previous offer"
          onClick={() => goToSlide(activeIndex - 1)}
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1 overflow-hidden">
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            loop
            spaceBetween={8}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {offers.map((offer) => {
              const OfferIcon = offer.icon;

              return (
                <SwiperSlide key={offer.id}>
                  <div className="rounded-md border border-[#ffb8d8] px-3 py-2 relative">
                    <div
                      className="
                    size-3 rounded-full border border-[#ffb8d8] bg-white
                    absolute top-1/2 -right-1.5 -translate-y-1/2 border-r-transparent border-b-transparent
                    rotate-[-40deg]
                    
                    "
                    ></div>
                    <div
                      className="
                    size-3 rounded-full border border-[#ffb8d8] bg-white
                    absolute top-1/2 -left-1.5 -translate-y-1/2 border-l-transparent border-b-transparent
                    rotate-40
                    
                    "
                    ></div>

                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d60865] text-white">
                        <OfferIcon size={13} />
                      </span>
                      <span className="truncate text-[14px] ">
                        <span className="font-medium">{offer.title}</span>{" "}
                        <span className=" text-[12px]">{offer.subtitle}</span>
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="h-full w-20 bg-linear-to-l from-white to-white/30 z-2 absolute top-0 right-0"></div>
        <button
          type="button"
          className="
          absolute top-1/2 right-4 -translate-y-1/2 z-10
                  flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-[#1a1e2b]"
          aria-label="Next offers"
          onClick={() => goToSlide(activeIndex + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default FirstBooking;
