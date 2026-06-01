"use client";
import React from "react";
import Hero from "./Hero";
import Discover from "./Discover";
import Hotels from "./Hotels";
import Round from "./Round";
import Recommended from "./Recommended";
import gita from "./Trip";
import Exclusive from "./Exclusive";
import Moments from "./Moments";
import TravelApp from "./TravelApp";

type Props = {};

function Home({}: Props) {
  return (
    <div
      className="relative z-0 min-h-0 w-full flex-1 overflow-y-auto pb-4 pt-28 md:pt-20 "
      role="main"
    >
      <Hero />
      <section className="container max-w-[1200px]! mx-auto mt-20 md:mt-16 mb-6 ">
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
