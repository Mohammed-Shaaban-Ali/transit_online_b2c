"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import hotelImage1 from "@/public/images/hotels/hotel1.webp";
import hotelImage2 from "@/public/images/hotels/hotel2.webp";
import hotelImage3 from "@/public/images/hotels/hotel3.webp";

import "swiper/css";
import "swiper/css/navigation";
import Link from "next/link";

const navButtonClass =
  "absolute top-1/2 z-10 hover:bg-primary hover:text-white flex h-10 w-10 shrink-0 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] swiper-button-disabled:pointer-events-none swiper-button-disabled:opacity-0 sm:h-11 sm:w-11";

type Props = {};
const hotels = [
  {
    id: 1,
    image: hotelImage1,
    alt: "Hyatt Place Dubai Al Rigga Residences",
    rating: 9.2,
    reviews: 76,
    name: "Hyatt Place Dubai Al Rigga Residences",
    subName: "Flyer Exclusive",
    stars: 4,
    address: "Deira",
    distance: "10m from Deira",
    benefits: ["Free Cancellation"],
    oldPrice: 58,
    price: 31,
  },
  {
    id: 2,
    image: hotelImage2,
    alt: "Hyatt Place Dubai Al Rigga",
    rating: 8.9,
    reviews: 188,
    name: "Hyatt Place Dubai Al Rigga",
    subName: "Special Discount",
    stars: 4,
    address: "Deira",
    distance: "10m from Deira",
    benefits: ["Free Cancellation"],
    oldPrice: 42,
    price: 35,
  },
  {
    id: 3,
    image: hotelImage3,
    alt: "Best Western Premier M Four Hotels",
    rating: 8.3,
    reviews: 385,
    name: "Best Western Premier M Four Hotels",
    subName: "Flyer Exclusive",
    stars: 4,
    address: "Deira",
    distance: "10m from Deira",
    benefits: ["Free Cancellation"],
    oldPrice: 29,
    price: 19,
  },
  {
    id: 4,
    image: hotelImage1,
    alt: "The George Hotel by Saffron",
    rating: 8.6,
    reviews: 241,
    name: "The George Hotel by Saffron",
    subName: "Free Cancellation",
    stars: 5,
    address: "Bur Dubai",
    distance: "13m from Deira",
    benefits: ["Free Cancellation"],
    oldPrice: 55,
    price: 42,
  },
  {
    id: 5,
    image: hotelImage2,
    alt: "Rove City Centre",
    rating: 9.0,
    reviews: 516,
    name: "Rove City Centre",
    subName: "Breakfast included",
    stars: 5,
    address: "Port Saeed",
    distance: "15m from Deira",
    benefits: ["Breakfast included"],
    oldPrice: 63,
    price: 49,
  },
  {
    id: 6,
    image: hotelImage3,
    alt: "City Avenue Al Reqqa Hotel",
    rating: 8.7,
    reviews: 302,
    name: "City Avenue Al Reqqa Hotel",
    subName: "Special Discount",
    stars: 4,
    address: "Al Rigga",
    distance: "9m from Deira",
    benefits: ["Free Cancellation"],
    oldPrice: 39,
    price: 28,
  },
  {
    id: 7,
    image: hotelImage1,
    alt: "Avani Deira Dubai Hotel",
    rating: 8.4,
    reviews: 267,
    name: "Avani Deira Dubai Hotel",
    subName: "Flyer Exclusive",
    stars: 5,
    address: "Deira",
    distance: "12m from Deira",
    benefits: ["Free Cancellation"],
    oldPrice: 49,
    price: 37,
  },
  {
    id: 8,
    image: hotelImage2,
    alt: "Coral Dubai Deira Hotel",
    rating: 8.5,
    reviews: 190,
    name: "Coral Dubai Deira Hotel",
    subName: "Free Cancellation",
    stars: 4,
    address: "Al Muraqqabat",
    distance: "11m from Deira",
    benefits: ["Free Cancellation"],
    oldPrice: 47,
    price: 33,
  },
  {
    id: 9,
    image: hotelImage3,
    alt: "J5 Hotels Port Saeed",
    rating: 8.8,
    reviews: 154,
    name: "J5 Hotels Port Saeed",
    subName: null,
    stars: 4,
    address: "Port Saeed",
    distance: "14m from Deira",
    benefits: ["Free Cancellation"],
    oldPrice: 54,
    price: 41,
  },
];

function FeaturedProperties({}: Props) {
  const locale = useLocale();
  const t = useTranslations("BookingDetails.FeaturedProperties");
  const isRtl = locale === "ar";

  return (
    <section className=" space-y-6 bg-white px-6 py-8 rounded">
      <div className="flex items-center justify-between gap-4">
        <h2 className=" text-22 font-bold leading-none ">{t("title")}</h2>
        <Link
          href="/hotels"
          className="text-16 font-medium leading-none text-primary flex items-center gap-1 hover:underline"
        >
          {t("showMore")} <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Link>
      </div>

      <div className="relative min-w-0 max-w-full sm:mx-5">
        <button
          id="hotels-top-prev"
          type="button"
          className={`${navButtonClass}
            
            hidden sm:flex
            
            sm:start-2 translate-x-0 md:start-0 md:-translate-x-1/2
            md:rtl:start-0 md:rtl:translate-x-1/2
            `}
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
          className={`${navButtonClass}
             hidden sm:flex
             
    
              
              end-0 sm:end-2 translate-x-0 md:end-0 md:translate-x-1/2
            md:rtl:end-0 md:rtl:-translate-x-1/2
              `}
          aria-label={t("nextSlide")}
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
            prevEl: "#hotels-top-prev",
            nextEl: "#hotels-top-next",
          }}
          watchOverflow
          className="min-w-0 max-w-full"
          spaceBetween={12}
          slidesPerView={1}
          onResize={(swiper) => swiper.navigation?.update()}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 14,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 16,
            },
          }}
        >
          {hotels.map((hotel) => (
            <SwiperSlide key={hotel.id} className="min-w-0 max-w-full h-full">
              <article
                className="group cursor-pointer rounded-lg border border-gray-300 
               transition-all duration-300 hover:-translate-y-1 overflow-hidden
               h-max
               "
              >
                {/* Image with rating badge */}
                <div className="relative ">
                  <Image
                    src={hotel.image}
                    alt={hotel.alt}
                    className="h-[160px] w-full object-cover sm:h-[190px]
                    "
                  />

                  {/* Rating badge */}
                  <div className="absolute -bottom-3.5 start-5 flex items-center overflow-hidden rounded-full border-2 border-primary bg-white h-7 z-10">
                    <span className="flex items-center gap-0.5 bg-primary px-3.5 py-1 text-xs font-semibold text-white rounded-br-full h-full">
                      <span>{hotel.rating}</span>
                      <span className="font-normal opacity-80">/10</span>
                    </span>
                    <span className="bg-white px-2.5 py-1 text-xs font-medium text-black/70">
                      {hotel.reviews.toLocaleString()} {t("reviews")}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex h-full flex-col p-3.5 pt-7">
                  {/* Hotel name */}
                  <h3 className="text-16 font-semibold leading-tight text-gray-900 line-clamp-1 ">
                    {hotel.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-0.5 text-[#f2a300]">
                    {Array.from({ length: hotel.stars }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-4 w-4 fill-current stroke-current"
                      />
                    ))}
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-15 text-gray-500 font-normal leading-tight">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{hotel.distance}</span>
                  </div>

                  <div className="mt-1 space-y-2">
                    {hotel.benefits.map((benefit: string) => (
                      <p
                        key={benefit}
                        className="text-14 font-medium text-primary"
                      >
                        {benefit}
                      </p>
                    ))}
                  </div>

                  <div className="mt-7 flex justify-end">
                    <span className="bg-[#fff2f7] px-2.5 py-1 text-13  text-[#ff4b8a]">
                      {hotel.subName ?? " "}
                    </span>
                  </div>

                  <div className="mt-4 flex items-end justify-end gap-2">
                    <span className="text-14 leading-none text-gray-500 line-through">
                      US${hotel.oldPrice}
                    </span>
                    <span className="text-24 font-bold leading-none text-gray-900">
                      US${hotel.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="mt-4 h-10 w-full rounded bg-primary text-16 font-semibold text-white transition-colors duration-200 hover:bg-primary/90"
                  >
                    View
                    {t("view")}
                  </button>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default FeaturedProperties;
