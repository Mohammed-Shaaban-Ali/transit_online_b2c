"use client";

import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

interface Facility {
  facility?: string;
  facilityIcon?: string;
  facilityType?: string;
  name?: string;
}

export default function Facilities({ amenities }: { amenities?: Facility[] }) {
  const t = useTranslations("Facilities");
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  if (!amenities || amenities.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">{t("noFacilities")}</p>
      </div>
    );
  }

  return (
    <section className="pt-8">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-22 font-bold mb-3">{t("title")}</h3>{" "}
        <div className="flex items-center gap-2.5 ms-auto">
          <Button
            onClick={() => swiperRef.current?.slidePrev()}
            variant={!isBeginning ? "default" : "outline-primary"}
            size="icon"
            className="rounded-full"
            disabled={isBeginning}
          >
            <IoIosArrowBack className="size-5 rtl:rotate-180" />
          </Button>
          <Button
            onClick={() => swiperRef.current?.slideNext()}
            variant={!isEnd ? "default" : "outline-primary"}
            size="icon"
            className="rounded-full"
            disabled={isEnd}
          >
            <IoIosArrowForward className="size-5 rtl:rotate-180" />
          </Button>
        </div>
      </div>
      <section className="w-full">
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
          spaceBetween={12}
          // slidesPerView="auto"
          breakpoints={{
            0: {
              slidesPerView: 2,
              spaceBetween: 8,
            },
            480: {
              slidesPerView: 3,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 4,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 12,
            },
            1024: {
              slidesPerView: 8,
              spaceBetween: 12,
            },
          }}
          className="pb-2!"
        >
          {amenities.map((facility, index) => (
            <SwiperSlide key={index} className="">
              <div
                className="flex flex-col justify-center items-center gap-3 min-w-24 min-h-24 bg-gray-100
              cursor-pointer transition-all duration-300
              rounded-lg p-2.5 hover:bg-gray-200"
              >
                <div className="relative w-8 h-8 shrink-0">
                  {facility.facilityIcon ? (
                    <Image
                      src={facility.facilityIcon}
                      alt={facility.facility || t("facility")}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <CheckIcon className="w-5 h-5 text-green-600" />
                  )}
                </div>
                <p className="text-14 text-center">
                  {facility.facility || facility.name || t("facility")}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </section>
  );
}
