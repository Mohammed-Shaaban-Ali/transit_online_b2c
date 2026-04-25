"use client";

import Image from "next/image";
import { CheckCircle, CircleDot } from "lucide-react";
import { useTranslations } from "next-intl";

export default function FreePromoCodesSection() {
  const t = useTranslations("FlightBookingPageNested.freePromoCodes");
  const promoCodes = [
    { title: t("item1"), iconColor: "bg-cyan-500" },
    { title: t("item2"), iconColor: "bg-rose-500" },
    { title: t("item3"), iconColor: "bg-cyan-500" },
    { title: t("item4"), iconColor: "bg-cyan-500" },
  ];

  return (
    <section className="mt-2 rounded-2xl border border-gray-100 bg-white p-4">
      <div className="mb-6 flex items-center gap-3">
        <Image
          src="/images/PromoCodes.webp"
          alt={t("title")}
          width={32}
          height={32}
          className="h-8 w-8 object-contain"
        />
        <h3 className="text-24 font-bold leading-none ">{t("title")}</h3>
      </div>

      <div className="space-y-4">
        {promoCodes.map((item) => (
          <div
            key={item.title}
            className="grid grid-cols-1 rounded-lg border border-primary bg-white md:grid-cols-[1fr_240px]"
          >
            <div
              className="
            relative
            flex items-center justify-between gap-4 border-b border-dashed border-primary
            px-5 py-4 md:border-b-0 md:border-r"
            >
              <div className="absolute hidden md:block -top-1.5 -right-1.5 w-3 h-3 bg-white border-b border-primary rounded-full"></div>
              <div className="absolute hidden md:block -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-t border-primary rounded-full"></div>
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${item.iconColor}`}
                >
                  <CircleDot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold ">{item.title}</p>
                  <p className="text-[14px] font-medium text-gray-500">
                    {t("claimFreePromoCode")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="text-[14px] font-medium text-primary"
              >
                {t("viewDetails")}
              </button>
            </div>

            <div className="flex items-center justify-center px-5 py-4">
              <button
                type="button"
                className="inline-flex h-11 min-w-[154px] items-center justify-center gap-2 rounded-md bg-primary 
                px-5 text-[16px] font-medium text-white"
              >
                <CheckCircle size={16} />
                {t("claimed")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
