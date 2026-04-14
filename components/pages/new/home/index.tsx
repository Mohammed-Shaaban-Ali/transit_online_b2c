"use client";
import React from "react";
import Hero from "./Hero";
import Discover from "./Discover";
import Hotels from "./Hotels";
import Round from "./Round";
import Recommended from "./Recommended";
import { useSidebarMini } from "../layout/sidebar-mini-context";
import Trip from "./Trip";
import Exclusive from "./Exclusive";
import Moments from "./Moments";
import TravelApp from "./TravelApp";

type Props = {};

function Home({}: Props) {
  const { isMini } = useSidebarMini();

  return (
    <div
      className={`relative z-0 min-h-0 flex-1 overflow-y-auto mt-[64px] px-3 pb-4 md:pt-[68px] md:me-5 md:mt-8 md:px-0 ${isMini ? "md:ms-28" : "md:ms-8"}`}
      role="main"
    >
      <Hero />
      <section className="container max-w-[1200px]! mx-auto mt-16 mb-6 ">
        <Exclusive />
        <Discover />
        <Trip />
        <Moments />
        <Hotels />
        <Round />
      </section>
      <TravelApp />
      <section className="container max-w-[1200px]! mx-auto mb-6">
        <Recommended />{" "}
      </section>
    </div>
  );
}

export default Home;
