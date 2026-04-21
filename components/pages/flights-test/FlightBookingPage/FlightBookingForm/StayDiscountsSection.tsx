"use client";

import Image from "next/image";
import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

export default function StayDiscountsSection() {
  const t = useTranslations("FlightBookingPageNested.stayDiscounts");
  const discountItems = [
    {
      title: t("item1Title"),
      offer: t("item1Offer"),
    },
    {
      title: t("item2Title"),
      offer: t("item2Offer"),
    },
    {
      title: t("item3Title"),
      offer: t("item3Offer"),
    },
  ];

  return (
    <section className="mt-2">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-28 font-bold leading-none ">{t("title")}</h3>
        <Info size={18} className="text-gray-600" />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white px-5 py-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {discountItems.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <Image
                src="/images/pic_coupon.png"
                alt={item.title}
                width={88}
                height={56}
                className="mb-3 h-[56px] w-auto object-contain"
              />
              <p className="mb-1 text-[14px] font-medium  line-clamp-1">
                {item.title}
              </p>
              <p className="text-[14px] font-semibold text-[#E46A00]">
                {item.offer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
