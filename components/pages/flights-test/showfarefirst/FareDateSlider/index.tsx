"use client";

import { useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper as SwiperType } from "swiper";
import { format, addDays, differenceInDays, parseISO } from "date-fns";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { ar, enUS } from "date-fns/locale";
import "swiper/css";
import "swiper/css/navigation";

type Props = {
  departureDate: string;
  returnDate?: string;
  tripType: string;
  searchParams: Record<string, string>;
};

function FareDateSlider({
  departureDate,
  returnDate,
  tripType,
  searchParams,
}: Props) {
  const router = useRouter();
  const t = useTranslations("ShowFarePage.FareDateSlider");
  const locale = useLocale();
  const dfLocale = locale === "ar" ? ar : enUS;
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const formatMonthDay = (d: Date) =>
    format(d, "MMM d", {
      locale: dfLocale,
    });

  const isRoundTrip = tripType === "roundTrip";
  const tripDuration = useMemo(() => {
    if (!isRoundTrip || !returnDate || !departureDate) return 0;
    return differenceInDays(parseISO(returnDate), parseISO(departureDate));
  }, [departureDate, returnDate, isRoundTrip]);

  const dateItems = useMemo(() => {
    const depDate = parseISO(departureDate);
    const items = [];
    const daysRange = 7;

    for (let offset = -daysRange; offset <= daysRange; offset++) {
      const dep = addDays(depDate, offset);
      const depStr = format(dep, "yyyy-MM-dd");

      let label: string;
      if (isRoundTrip && tripDuration > 0) {
        const ret = addDays(dep, tripDuration);
        label = `${formatMonthDay(dep)}-${formatMonthDay(ret)}`;
      } else {
        label = formatMonthDay(dep);
      }

      items.push({
        id: offset + daysRange,
        label,
        depDate: depStr,
        retDate:
          isRoundTrip && tripDuration > 0
            ? format(addDays(dep, tripDuration), "yyyy-MM-dd")
            : undefined,
        isSelected: offset === 0,
      });
    }

    return items;
  }, [departureDate, isRoundTrip, tripDuration, dfLocale]);

  const handleDateSelect = (item: (typeof dateItems)[0]) => {
    const params = new URLSearchParams();
    params.set("from", searchParams.from);
    params.set("to", searchParams.to);
    params.set("tripType", searchParams.tripType);
    params.set("nonstop", searchParams.nonstop);
    params.set("departureDate", item.depDate);
    if (item.retDate) {
      params.set("returnDate", item.retDate);
    }
    params.set("adults", searchParams.adults);
    if (Number(searchParams.children) > 0) {
      params.set("children", searchParams.children);
    }
    if (Number(searchParams.infants) > 0) {
      params.set("infants", searchParams.infants);
    }
    params.set("cabinClass", searchParams.cabinClass);

    router.push(`/flights-test/showfarefirst?${params.toString()}`);
  };

  return (
    <div className="hidden md:flex items-center bg-white rounded-lg">
      <button
        type="button"
        className="mx-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm cursor-pointer text-gray-700 transition-colors hover:text-primary disabled:opacity-40"
        onClick={() => swiperInstance?.slidePrev()}
        disabled={!swiperInstance || isBeginning}
        aria-label={t("previousDates")}
      >
        <ChevronLeft size={22} className="rtl:rotate-180" />
      </button>

      <Swiper
        modules={[Navigation]}
        slidesPerView={6}
        spaceBetween={0}
        speed={350}
        slidesPerGroup={1}
        watchOverflow={false}
        initialSlide={4}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper);
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        breakpoints={{
          320: { slidesPerView: 2.2 },
          640: { slidesPerView: 3.2 },
          1024: { slidesPerView: 5.2 },
          1280: { slidesPerView: 7 },
        }}
        className="flex-1"
      >
        {dateItems.map((item, index) => {
          const isSelected = item.depDate === departureDate;
          const isLastItem = index === dateItems.length - 1;

          return (
            <SwiperSlide key={item.id} className="flex items-center">
              <button
                type="button"
                onClick={() => handleDateSelect(item)}
                className="group relative cursor-pointer px-3 py-2 bg-white w-full flex items-center justify-center text-center transition-all duration-300 hover:text-primary"
              >
                <div className="flex flex-col items-center">
                  <p
                    className={`text-[14px] leading-tight ${
                      isSelected
                        ? "font-semibold text-black"
                        : "font-medium text-gray-700 group-hover:text-primary"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`mt-0.5 text-[13px] ${
                      isSelected
                        ? "font-medium text-black"
                        : "text-gray-500 group-hover:text-primary"
                    }`}
                  >
                    {isSelected ? t("selected") : t("view")}
                  </p>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full transition-colors ${
                      isSelected ? "bg-black" : "bg-transparent"
                    }`}
                  />
                </div>

                {!isLastItem && (
                  <span className="absolute end-0 top-1/2 h-7 w-px -translate-y-1/2 bg-gray-200" />
                )}
              </button>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <button
        type="button"
        className="mx-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-sm cursor-pointer text-gray-700 transition-colors hover:text-primary disabled:opacity-40"
        onClick={() => swiperInstance?.slideNext()}
        disabled={!swiperInstance || isEnd}
        aria-label={t("nextDates")}
      >
        <ChevronRight size={22} className="rtl:rotate-180" />
      </button>
    </div>
  );
}

export default FareDateSlider;
