"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import heroImage from "@/public/images/homeherro.jpg";

export default function LicenseHero() {
  const t = useTranslations("LicenseBooking");

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
        <div className="absolute inset-0 bg-black/55" />
        <section className="relative z-30 container mx-auto flex h-full max-w-[1200px]! flex-col justify-end pb-28">
          <h1 className="flex items-end gap-1 text-[48px] font-bold leading-tight text-white">
            {t("title")}
            <span className="mb-2.5 block h-2.5 w-2.5 rounded-full bg-yellow-400" />
          </h1>
          <p className="mt-1 max-w-2xl text-2xl text-white/90">
            {t("subtitle")}
          </p>
        </section>
      </div>

      {/* ── Mobile ── */}
      <div className="relative md:hidden">
        <div className="relative h-[280px] w-full">
          <Image
            src={heroImage}
            alt={t("heroImageAlt")}
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white via-white/60 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-10">
            <h1 className="flex items-end gap-1 text-[32px] font-bold leading-tight text-white drop-shadow-md">
              {t("title")}
              <span className="mb-2 block h-2.5 w-2.5 rounded-full bg-yellow-400" />
            </h1>
            <p className="mt-1 text-14 text-white/90">{t("subtitle")}</p>
          </div>
        </div>
      </div>
    </>
  );
}
