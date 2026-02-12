"use client";

import React, { useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import Image from "next/image";
import { FaHeart, FaStar, FaMapMarkerAlt } from "react-icons/fa";
import HeaderShared from "../HeaderShared";
import imagee1 from "@/public/images/recommended1.jpg";
import imagee2 from "@/public/images/recommended2.jpg";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
type Props = Record<string, never>;

function RecommendedHotel({ }: Props) {
  const t = useTranslations("Home.RecommendedHotel");
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [favorites, setFavorites] = useState<{ [key: number]: boolean }>({});

  const handleFavoriteClick = (index: number) => {
    setFavorites((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="pt-14 md:pt-16!">
      {/* titles */}
      <HeaderShared
        title={t("title")}
        subtitle={t("subtitle")}
        onClickNext={() => swiperRef.current?.slideNext()}
        onClickPrev={() => swiperRef.current?.slidePrev()}
        isBeginning={isBeginning}
        isEnd={isEnd}
      />
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        modules={[Navigation]}
        spaceBetween={16}
        slidesPerView={4}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
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
            slidesPerView: 3.7,
            spaceBetween: 16,
          },
        }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <SwiperSlide key={index}>
            <div
              className="bg-primary-light/50 rounded-3xl p-2.5 mb-1
             flex flex-col gap-2 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]
             group
             hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] transition-all duration-300
             hover:bg-primary-light hover:-translate-y-1.5
             "
            >
              <div className="w-full h-[240px] rounded-2xl bg-primary overflow-hidden relative">
                <Image
                  src={index % 2 === 0 ? imagee1 : imagee2}
                  alt={t("imageAlt")}
                  className="w-full h-full object-cover"
                  width={280}
                  height={250}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full absolute top-2 right-2 bg-white/30 hover:bg-white/50"
                  aria-label={t("addToFavorites")}
                  onClick={() => handleFavoriteClick(index)}
                >
                  <FaHeart
                    className={`w-5 h-5 ${favorites[index]
                      ? "text-red-500 fill-current stroke-red-500! stroke-2! "
                      : "text-white  stroke-red-500! stroke-2! fill-current"
                      }`}
                  />
                </Button>
              </div>
              <div className="flex flex-col gap-1.5 p-1.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-18 font-extrabold">
                    {t("hotelName", { name: "Culpa Est Similique" })}
                  </h3>
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-[#B79017]! fill-current" />
                    <span className="text-16 font-medium">4.92</span>
                  </div>
                </div>
                <p className="text-14 text-gray-500 font-medium leading-relaxed">
                  {t("hotelDescription", {
                    description:
                      "Voluptatibus Nemo Amet Voluptatem Quia Ipsa Eum. Est Ut Voluptas.",
                  })}
                </p>
                <div
                  className="flex items-center justify-between mt-1 
                border-t border-gray-400 pt-1
                border-dashed
                "
                >
                  <div>
                    <span className="text-18 font-bold">$139.00</span>
                    <span className="text-14 text-gray-500 font-normal ms-1">
                      {t("night")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
                    <span className="text-14 text-gray-600 font-normal">
                      {t("location", { location: "India" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default RecommendedHotel;
