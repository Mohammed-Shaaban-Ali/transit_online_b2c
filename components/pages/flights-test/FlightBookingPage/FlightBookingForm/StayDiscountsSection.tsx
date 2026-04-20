"use client";

import Image from "next/image";
import { Info } from "lucide-react";

const discountItems = [
  {
    title: "New user promo code (1st booking)",
    offer: "10% off (up to US$10.00)",
  },
  {
    title: "New user promo code (2nd booking...)",
    offer: "5% off (up to US$6.00)",
  },
  {
    title: "Flyer Exclusive offer",
    offer: "Up to 25% Off",
  },
];

export default function StayDiscountsSection() {
  return (
    <section className="mt-2">
      <div className="mb-3 flex items-center gap-2">
        <h3 className="text-28 font-bold leading-none ">Stay discounts</h3>
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
