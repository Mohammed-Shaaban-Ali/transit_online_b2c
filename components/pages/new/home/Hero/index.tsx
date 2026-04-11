import React from "react";
import heroSection from "@/public/images/new_hone/heroSection.webp";
import Image from "next/image";
type Props = {};

function Hero({}: Props) {
  return (
    <section className="relative h-[330px] w-full overflow-hidden rounded-2xl">
      <Image
        src={heroSection}
        alt="heroSection"
        width={1000}
        height={1000}
        className="w-full h-full object-cover object-right"
      />

      <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-5xl font-bold">
        Your Trip Starts Here
      </h1>
    </section>
  );
}

export default Hero;
