"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import "swiper/css";
import type { FareOption } from "../data/flights";
import { FareCard } from "./FareCard";
import { useTranslations } from "next-intl";

/** Space between slides — must match Swiper `spaceBetween` */
const GAP_PX = 12;
const MAX_SLIDE = 300;
/** On mobile show 1 full card + peek; on wider screens show ~2 */
const MOBILE_BREAKPOINT = 480;
const MOBILE_TARGET_VISIBLE = 1.1;
const DESKTOP_TARGET_VISIBLE = 2.15;

type Props = {
  fares: FareOption[];
  /** Empty string = no card selected */
  selectedId: string;
  onSelect: (id: string) => void;
  /** Footer label under the price (e.g. one-way vs round-trip). */
  tripLabel?: string;
};

function computeSlideWidth(containerWidth: number) {
  if (containerWidth <= 0) return MAX_SLIDE;
  const targetVisible =
    containerWidth < MOBILE_BREAKPOINT
      ? MOBILE_TARGET_VISIBLE
      : DESKTOP_TARGET_VISIBLE;
  const gapCount = Math.max(0, Math.ceil(targetVisible) - 1);
  const totalGaps = gapCount * GAP_PX;
  const raw = (containerWidth - totalGaps) / targetVisible;
  return Math.min(MAX_SLIDE, Math.floor(raw));
}

/** Horizontal Swiper: width follows dialog (no 100vw), overflow clipped, drag + arrows */
export default function FareSlider({
  fares,
  selectedId,
  onSelect,
  tripLabel,
}: Props) {
  const t = useTranslations("ShowFarePage.FareDialog.sliderNav");
  const swiperRef = useRef<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(MAX_SLIDE);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(true);

  const syncNav = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const cw = el.clientWidth;
      setSlideWidth(computeSlideWidth(cw));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const s = swiperRef.current;
    if (!s) return;
    s.update();
    syncNav(s);
  }, [slideWidth, fares.length]);

  useEffect(() => {
    const idx = fares.findIndex((f) => f.id === selectedId);
    if (idx !== -1 && swiperRef.current) {
      swiperRef.current.slideTo(idx, 300);
      syncNav(swiperRef.current);
    }
  }, [selectedId, fares]);

  const showNav = fares.length > 1;

  return (
    <div className="relative w-full min-w-0 max-w-full">
      {showNav && (
        <div className="mb-2 flex justify-end gap-1.5 sm:mb-3 sm:gap-2">
          <Button
            type="button"
            variant={isBeginning ? "outline-primary" : "default"}
            size="icon"
            className="size-8 shrink-0 rounded-full sm:size-9"
            disabled={isBeginning}
            aria-label={t("previousFares")}
            onClick={(e) => {
              e.stopPropagation();
              swiperRef.current?.slidePrev();
            }}
          >
            <ChevronLeft size={16} className="rtl:rotate-180 sm:h-[18px] sm:w-[18px]" />
          </Button>
          <Button
            type="button"
            variant={isEnd ? "outline-primary" : "default"}
            size="icon"
            className="size-8 shrink-0 rounded-full sm:size-9"
            disabled={isEnd}
            aria-label={t("nextFares")}
            onClick={(e) => {
              e.stopPropagation();
              swiperRef.current?.slideNext();
            }}
          >
            <ChevronRight size={16} className="rtl:rotate-180 sm:h-[18px] sm:w-[18px]" />
          </Button>
        </div>
      )}

      <div
        ref={containerRef}
        className="w-full min-w-0 max-w-full overflow-hidden"
      >
        <Swiper
          slidesPerView="auto"
          spaceBetween={GAP_PX}
          slidesPerGroup={1}
          speed={300}
          grabCursor
          watchOverflow
          className="fare-packages-swiper w-full max-w-full overflow-hidden pb-1"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            syncNav(swiper);
          }}
          onSlideChange={syncNav}
          onResize={(swiper) => syncNav(swiper)}
        >
          {fares.map((fare) => (
            <SwiperSlide
              key={fare.id}
              className="h-auto! box-border max-w-full"
              style={{
                width: slideWidth,
              }}
            >
              <FareCard
                fare={fare}
                isSelected={selectedId === fare.id}
                onSelect={() => onSelect(fare.id)}
                tripLabel={tripLabel}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
