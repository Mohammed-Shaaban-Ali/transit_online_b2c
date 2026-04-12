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
      className={`relative z-0 min-h-0 flex-1 overflow-y-auto pt-[68px] ms-8 me-5 mt-8 ${isMini ? "ms-28" : "ms-8"}`}
      role="main"
    >
      <Hero />
      <section className="container max-w-[1200px]! mx-auto my-12 mb-6">
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
