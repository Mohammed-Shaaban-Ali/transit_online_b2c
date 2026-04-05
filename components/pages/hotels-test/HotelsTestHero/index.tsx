"use client";

import React from "react";
import dynamic from "next/dynamic";
import heroImage from "@/public/images/hotels/hotelhero.webp";
import Image from "next/image";
import { useTranslations } from "next-intl";

const HotelsTestHotelSearchForm = dynamic(
  () =>
    import("@/components/pages/hotels-test/HotelsTestHero/Form/HotelsTestHotelSearchForm"),
);

type Props = {};

function HotelsTestHero({}: Props) {
  const t = useTranslations("HotelsTestPage.Hero");

  return (
    <>
      {/* ── Desktop ── */}
      <div className="relative hidden h-[500px] w-full md:block">
        <Image
          src={heroImage}
          alt={t("heroImageAlt")}
          fill
          className="object-cover object-top"
          priority
        />
        <section
          className="relative z-30 container max-w-[1200px]! mx-auto flex h-full
         flex-col justify-end pb-[200px]"
        >
          <h1 className="text-white text-[40px] font-bold leading-tight flex items-end gap-1 mb-2">
            {t("title")}
            <span className="bg-yellow-400 rounded-full w-2.5 h-2.5 block mb-2.5"></span>
          </h1>

          <div className="w-full max-w-full">
            <HotelsTestHotelSearchForm />
          </div>
        </section>
      </div>

      {/* ── Mobile ── */}
      <div className="md:hidden relative">
        {/* Background image — covers the top portion only */}
        <div className="absolute inset-x-0 top-0 h-[225px]">
          <Image
            src={heroImage}
            alt={t("heroImageAlt")}
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
            {t("title")}
            <span className="bg-yellow-400 rounded-full w-2.5 h-2.5 block mb-2"></span>
          </h1>

          {/* Form card */}
          <div
            className="rounded-md bg-white overflow-hidden p-3"
            style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.18)" }}
          >
            <HotelsTestHotelSearchForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default HotelsTestHero;
