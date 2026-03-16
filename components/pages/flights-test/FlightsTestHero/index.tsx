import React from "react";
import heroImage from "@/public/images/flights/flight_home_bg_v6.webp";
import Image from "next/image";
import HeroQuickActions from "@/components/pages/flights-test/HeroQuickActions";
type Props = {};

function FlightsTestHero({}: Props) {
  return (
    <div className="relative h-[500px] w-full">
      <Image src={heroImage} alt="hero" fill />
      <HeroQuickActions />

      <section className="relative z-10 container max-w-[1200px]! mx-auto flex h-full flex-col justify-end pb-24">
        <h1 className="text-white text-[40px] font-bold leading-tight flex items-end gap-1">
          Discover the best flight deals
          <span className="bg-yellow-400 rounded-full w-2.5 h-2.5 block mb-2.5"></span>
        </h1>
        <p className="mt-1 text-white/90 text-lg">Your next take-off awaits</p>

        <div className="mt-3 h-[210px] w-full rounded-[8px] bg-white" />
      </section>
    </div>
  );
}

export default FlightsTestHero;
