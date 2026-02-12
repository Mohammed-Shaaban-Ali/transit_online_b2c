import Image from "next/image";
import hotelImage from "@/public/images/hotels.jpg";
import HotelsList from "@/components/pages/hotel/HotelsList";
import { getTranslations } from "next-intl/server";

export default async function page() {
  const t = await getTranslations("HotelsPage");

  return (
    <section>
      <section className="bg-white h-[280px] sm:h-[320px] relative">
        <Image
          src={hotelImage}
          alt={t("imageAlt")}
          fill
          className="object-cover"
        />
        {/* title */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/15"></div>
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center ">
          <h1 className="text-white text-[48px]! font-extrabold">
            {t("title")}
          </h1>
        </div>
      </section>
      <HotelsList />
    </section>
  );
}
