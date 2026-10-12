"use client";

import dynamic from "next/dynamic";
import heroImage from "@/public/images/cruises.webp";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCruiseSearchFromUrl } from "@/hooks/useCruiseSearchFromUrl";
import { cn } from "@/lib/utils";

const CruiseSearchForm = dynamic(
  () => import("@/components/pages/cruises/CruiseSearchForm"),
  {
    ssr: false,
    loading: () => (
      <div className="h-[135px] w-full animate-pulse rounded-md bg-muted" />
    ),
  },
);

type Props = {
  centered?: boolean;
};

function CruiseHero({ centered = false }: Props) {
  const t = useTranslations("CruisePage.Hero");
  useCruiseSearchFromUrl();

  const formClassName = "mt-0 shadow-none md:mt-0 md:p-4";

  return (
    <>
      {/* Desktop */}
      <div
        className={cn(
          "relative hidden w-full md:flex",
          centered
            ? "min-h-screen items-center justify-center"
            : "h-[500px] items-end pb-[120px]",
        )}
      >
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt={t("heroImageAlt")}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-primary/20" />
        </div>

        <div className="relative z-30 container mx-auto w-full max-w-[1200px]! px-4">
          <CruiseSearchForm stayOnPage className={formClassName} />
        </div>
      </div>

      {/* Mobile */}
      <div
        className={cn(
          "relative flex w-full md:hidden",
          centered
            ? "min-h-screen items-center justify-center px-4 py-20"
            : "flex-col pb-8 pt-24",
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0",
            centered ? "inset-y-0" : "top-0 h-[225px]",
          )}
        >
          <Image
            src={heroImage}
            alt={t("heroImageAlt")}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="absolute inset-0 bg-primary/20" />
          {!centered && (
            <div
              className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#f9f9f9] via-[#f9f9f9]/60 to-transparent"
              aria-hidden
            />
          )}
        </div>

        <div className={cn("relative z-10 w-full", !centered && "px-4")}>
          <div className="overflow-hidden rounded-md bg-white shadow-sm">
            <CruiseSearchForm stayOnPage className="mt-0 shadow-none md:mt-0" />
          </div>
        </div>
      </div>
    </>
  );
}

export default CruiseHero;
