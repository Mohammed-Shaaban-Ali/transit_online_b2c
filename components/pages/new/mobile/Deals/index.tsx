"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import discoverImage1 from "@/public/images/flights/Discover1.png";
import discoverImage2 from "@/public/images/flights/Discover2.png";
import discoverImage3 from "@/public/images/flights/Discover3.png";
import "swiper/css";
import "swiper/css/pagination";

const titles = [
  {
    title: "Secure payment",
    link: "https://ak-d.tripcdn.com/images/0AS6b1200090fx7s7F635.png",
  },
  {
    title: "Support in approx. 30s",
    link: "https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png",
  },
];

const discoverBanners = [
  { id: 1, image: discoverImage1, alt: "Discover deal 1" },
  { id: 2, image: discoverImage2, alt: "Discover deal 2" },
  { id: 3, image: discoverImage3, alt: "Discover deal 3" },
];

export default function Deals() {
  return (
    <section className="mt-9">
      <h2 className="mb-2.5 text-[22px] font-bold leading-tight text-[#111827]">
        Limited-time deals
      </h2>

      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        // pagination={{ clickable: true }}
        className="overflow-hidden rounded-3xl"
      >
        {discoverBanners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full overflow-hidden rounded-4xl">
              <Image
                src={banner.image}
                alt={banner.alt}
                className="h-[140px] w-full object-cover"
                priority={banner.id === 1}
              />
              <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                {banner.id}/{discoverBanners.length}
              </span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-3 flex items-center justify-center gap-3">
        {titles.map((item, index) => (
          <div key={item.title} className="flex items-center gap-1">
            <Image
              src={item.link}
              alt={item.title}
              width={20}
              height={20}
              className="size-4"
            />
            <p className="text-[13px] font-medium text-[#4B5563]">
              {item.title}
            </p>

            {index === 0 && <div className="ms-3 h-3 w-px bg-[#9CA3AF]"></div>}
          </div>
        ))}
      </div>
    </section>
  );
}
