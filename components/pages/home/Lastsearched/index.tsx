"use client";

import { useRef, useState } from "react";
import { FaUser } from "react-icons/fa";
import { BsFillCalendar2DateFill } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
import HeaderShared from "../HeaderShared";
type Props = Record<string, never>;
import imagee1 from "@/public/images/recommended1.jpg";
import imagee2 from "@/public/images/recommended2.jpg";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
function Lastsearched({ }: Props) {
  const t = useTranslations("Home.Lastsearched");
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  return (
    <div className="py-14 md:py-16!">
      {/* titles */}
      <HeaderShared
        title={t("title")}
        onClickPrev={() => swiperRef.current?.slidePrev()}
        onClickNext={() => swiperRef.current?.slideNext()}
        isBeginning={isBeginning}
        isEnd={isEnd}
      />
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={4}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 14,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 16,
          },
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-gray-50 rounded-2xl p-2.5 border border-gray-200  
             flex items-center gap-2 justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-14 h-14 rounded-full bg-primary overflow-hidden">
                  <Image
                    src={index % 2 === 0 ? imagee1 : imagee2}
                    alt={t("imageAlt")}
                    className="w-full h-full object-cover"
                    width={56}
                    height={56}
                  />
                </div>
                <div className="flex flex-col gap-0">
                  <h3 className="text-18 font-bold">
                    {t("destination", { city: "Amsterdam" })}
                  </h3>
                  <div className="flex items-center gap-2 text-12 text-gray-500 font-bold">
                    <FaUser className="text-gray-400" />
                    {t("passengers", { adults: 2, children: 2 })}
                  </div>
                  <div className="flex items-center gap-2 text-12 text-gray-500 font-bold">
                    <BsFillCalendar2DateFill className="text-gray-400" />
                    {t("date", { date: "02 January 2024" })}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full
                bg-gray-100 hover:bg-gray-200 

                "
              >
                <GoArrowRight className="size-4 rtl:rotate-180" />
              </Button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Lastsearched;
