import Image from "next/image";
import React from "react";
import supportIcon from "@/public/images/contractimage.jpg";
type Props = {};
// src = "https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png";

function AddOIns({}: Props) {
  return (
    <section className="space-y-6 bg-white px-6 py-8 rounded">
      <h3 className="text-24 font-bold leading-none ">Your Add-ons</h3>

      <div
        className="flex items-center gap-3 px-3 py-5 bg-gray-100 cursor-pointer
      hover:bg-primary/10 border border-gray-200 hover:border-primary  transition-all duration-300
      w-[300px]"
      >
        <Image
          src="/images/PromoCodes.webp"
          alt="Your Add-ons"
          width={32}
          height={32}
          className="h-7 w-7 object-contain"
        />
        <p className="text-16 font-medium leading-none ">Promo code</p>
      </div>
    </section>
  );
}

export default AddOIns;
