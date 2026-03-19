"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";

type FareDateItem = {
  id: number;
  range: string;
  price?: string;
};

const fareDateItems: FareDateItem[] = [
  { id: 1, range: "Apr 9-Apr 12", price: "US$175" },
  { id: 2, range: "Apr 10-Apr 13", price: "US$175" },
  { id: 3, range: "Apr 11-Apr 14", price: "US$175" },
  { id: 4, range: "Apr 12-Apr 15", price: "US$175" },
  { id: 5, range: "Apr 13-Apr 16", price: "US$175" },
  { id: 6, range: "Apr 14-Apr 17", price: "US$175" },
  { id: 7, range: "Apr 15-Apr 18", price: "US$175" },
  { id: 8, range: "Apr 16-Apr 19", price: "US$175" },
  { id: 9, range: "Apr 17-Apr 20", price: "US$175" },
  { id: 10, range: "Apr 18-Apr 21", price: "US$175" },
  { id: 11, range: "Apr 19-Apr 22", price: "US$175" },
  { id: 12, range: "Apr 20-Apr 23", price: "US$175" },
  { id: 13, range: "Apr 21-Apr 24", price: "US$175" },
  { id: 14, range: "Apr 22-Apr 25", price: "US$175" },
  { id: 15, range: "Apr 23-Apr 26", price: "US$175" },
  { id: 16, range: "Apr 24-Apr 27", price: "US$175" },
];

function FareDateSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [selectedId, setSelectedId] = useState(4);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => {
    if (!swiperInstance) return;
    swiperInstance.slidePrev();
  };

  const handleNext = () => {
    if (!swiperInstance) return;
    swiperInstance.slideNext();
  };

  return (
    <div className="flex items-center  bg-white rounded-lg">
      <button
        type="button"
        className="mx-1 flex h-10 w-10 shrink-0 items-center
         justify-center rounded-sm
          cursor-pointer
         text-gray-700 transition-colors hover:text-primary disabled:opacity-40"
        onClick={handlePrev}
        disabled={!swiperInstance || isBeginning}
        aria-label="Previous dates"
      >
        <ChevronLeft size={22} />
      </button>

      <Swiper
        modules={[Navigation]}
        slidesPerView={6}
        spaceBetween={0}
        speed={350}
        slidesPerGroup={1}
        watchOverflow={false}
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
        {fareDateItems.map((item, index) => {
          const isSelected = selectedId === item.id;
          const isLastItem = index === fareDateItems.length - 1;

          return (
            <SwiperSlide key={item.id} className="flex items-center ">
              <button
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`group relative cursor-pointer px-3 py-2  bg-white w-full flex items-center justify-center 
                   text-center transition-all duration-300 hover:text-primary ${
                     isSelected ? "" : ""
                   }`}
              >
                <div className="flex flex-col items-center">
                  <p
                    className={`text-[14px] leading-tight ${
                      isSelected
                        ? "font-semibold text-black"
                        : "font-medium text-gray-700 group-hover:text-primary"
                    }`}
                  >
                    {item.range}
                  </p>
                  <p
                    className={`mt-0.5 text-[13px] ${
                      isSelected
                        ? "font-medium text-black"
                        : "text-gray-500 group-hover:text-primary"
                    }`}
                  >
                    {isSelected && item.price ? item.price : "View"}
                  </p>
                  <span
                    className={`absolute bottom-0 left-0 h-[2px] w-full transition-colors ${
                      isSelected ? "bg-black" : "bg-transparent "
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
        onClick={handleNext}
        disabled={!swiperInstance || isEnd}
        aria-label="Next dates"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  );
}

export default FareDateSlider;
