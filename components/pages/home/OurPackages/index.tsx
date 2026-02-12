"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
import HeaderShared from "../HeaderShared";
import imagee1 from "@/public/images/recommended1.jpg";
import imagee2 from "@/public/images/recommended2.jpg";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
function OurPackages() {
  const t = useTranslations("Home.OurPackages");
  const swiperRef = useRef<any>(null);

  return (
    <div className="py-14 md:py-16!">
      {/* titles */}
      <HeaderShared
        title={t("title")}
        subtitle={t("subtitle")}
        description={t("description")}
        ViewMore
      />
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
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
              className="bg-primary-light/30 rounded-3xl p-2.5 border border-primary/20  
             flex flex-col gap-2
             group
             hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)] transition-all duration-300
             hover:-translate-y-1
             "
            >
              <div className="w-full h-[200px] rounded-2xl bg-primary overflow-hidden">
                <Image
                  src={index % 2 === 0 ? imagee1 : imagee2}
                  alt={t("imageAlt")}
                  className="w-full h-full object-cover"
                  width={280}
                  height={200}
                />
              </div>
              <div className="flex flex-col gap-1.5 p-1.5">
                <h3 className="text-16 text-gray-500 font-normal ">
                  {t("packageName")}
                </h3>
                <h4 className="text-18 text-primary font-bold ">200.00$</h4>
                <div className="flex items-center gap-1.5 justify-between -mt-1">
                  <p className="text-14 text-gray-500 font-normal ">
                    {t("activities", { tours: 356, activities: 248 })}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full bg-primary/20 hover:bg-primary/80 hover:text-white cursor-pointer"
                  >
                    <GoArrowRight className="size-4 rtl:rotate-180" />
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default OurPackages;
