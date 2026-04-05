import React from "react";
import heroImage from "@/public/images/flights/flight_home_bg_v6.webp";
import Image from "next/image";
import HeroQuickActions from "@/components/pages/flights-test/HeroQuickActions";
import Form from "./Form";
import { useTranslations } from "next-intl";
type Props = {};

function FlightsTestHero({}: Props) {
  const t = useTranslations("FlightsTestPage.Hero");
  return (
    <>
      {/* ── Desktop ── */}
      <div className="relative hidden h-[500px] w-full md:block">
        <Image
          src={heroImage}
          alt="hero"
          fill
          className="object-cover object-top"
          priority
        />
        <HeroQuickActions />
        <section className="relative z-30 container max-w-[1200px]! mx-auto flex h-full flex-col justify-end pb-24">
          <h1 className="text-white text-[40px] font-bold leading-tight flex items-end gap-1">
            {t("title")}
            <span className="bg-yellow-400 rounded-full w-2.5 h-2.5 block mb-2.5"></span>
          </h1>
          <p className="mt-1 text-white/90 text-lg">
            {t("subtitle")}
          </p>
          <Form />
        </section>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden relative">
        {/* Background image — covers the top portion only */}
        <div className="absolute inset-x-0 top-0 h-[225px]">
          <Image
            src={heroImage}
            alt="hero"
            fill
            className="object-cover object-top"
            priority
          />
          {/* Bottom fade from image into the dark bg color */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 
          bg-linear-to-t from-[#f9f9f9] via-[#f9f9f9]/60 to-transparent "
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col px-4 pt-6">
          {/* Title */}
          <h1
            className="text-white text-[32px] font-bold leading-tight flex items-end gap-1 
          drop-shadow-md mb-4"
          >
            {t("mobileTitle")}
            <span className="bg-yellow-400 rounded-full w-2.5 h-2.5 block mb-2"></span>
          </h1>

          {/* Form card */}
          <div
            className="rounded-2xl bg-white overflow-hidden"
            style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)" }}
          >
            <Form />
          </div>
        </div>
      </div>
    </>
  );
}

export default FlightsTestHero;
