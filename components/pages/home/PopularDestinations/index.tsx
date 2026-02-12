"use client";

import Image from "next/image";
import { GoArrowRight } from "react-icons/go";
import HeaderShared from "../HeaderShared";
import imagee1 from "@/public/images/recommended1.jpg";
import imagee2 from "@/public/images/recommended2.jpg";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
type Props = Record<string, never>;

function PopularDestinations({}: Props) {
  const t = useTranslations("Home.PopularDestinations");
  return (
    <div className="py-5! ">
      {/* titles */}
      <HeaderShared title={t("title")} subtitle={t("subtitle")} />
      <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {Array.from({ length: 7 }).map((_, index) => (
          <div
            key={index}
            className={`relative
             w-full  h-[300px]! rounded-2xl! overflow-hidden! group
              ${
                index === 0 ? "col-span-1 md:col-span-2 ms-auto" : "col-span-1"
              } `}
          >
            <Image
              src={index % 2 === 0 ? imagee1 : imagee2}
              alt="destination"
              className="object-cover w-full h-full group-hover:scale-[1.03] transition-all duration-300"
              width={500}
              height={500}
            />
            {/* content */}
            <div
              className={`absolute bottom-2.5 
            w-full max-w-[calc(min(94%,320px))]! h-fit rounded-xl! bg-white/85 group-hover:bg-white transition-all
            duration-300 group-hover:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.08)]
            p-2.5 px-4
             ${
               index === 0
                 ? " md:start-2.5 md:translate-x-0 left-1/2 -translate-x-1/2 "
                 : "left-1/2 -translate-x-1/2 "
             }`}
            >
              <h3 className="text-18 font-bold">
                {t("destination", { name: "Western Europe" })}
              </h3>
              <div className="flex items-center gap-1.5 justify-between -mt-1 ">
                <p className="text-14 text-gray-500 font-normal ">
                  {t("activities", { tours: 356, activities: 248 })}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full
                bg-white/80 group-hover:bg-gray-100
                "
                >
                  <GoArrowRight className="size-4 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default PopularDestinations;
