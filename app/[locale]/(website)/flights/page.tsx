import Image from "next/image";
import flightsImage from "@/public/images/flights.jpg";
import FlightsList from "@/components/pages/flights/FlightsList";
import { getTranslations } from "next-intl/server";

export default async function page() {
  const t = await getTranslations("Flights");
  return (
    <section>
      <section className="bg-white h-[280px] sm:h-[320px] relative">
        <Image
          src={flightsImage}
          alt={t("imageAlt")}
          fill
          className="object-cover object-[center_30%]"
        />
        {/* title */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/15"></div>
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 text-center ">
          <h1 className="text-white text-[48px]! font-extrabold">
            {t("title")}
          </h1>
        </div>
      </section>
      <FlightsList />
    </section>
  );
}
