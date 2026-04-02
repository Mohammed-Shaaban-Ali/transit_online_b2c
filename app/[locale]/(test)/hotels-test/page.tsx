import { getTranslations } from "next-intl/server";
import FloatingSideActions from "@/components/pages/flights-test/FloatingSideActions";
import HotelsTestHero from "@/components/pages/hotels-test/HotelsTestHero";
import PriceMatch from "@/components/pages/hotels-test/PriceMatch";
import TopHotels from "@/components/pages/hotels-test/TopHotels";
import Recommendations from "@/components/pages/hotels-test/Recommendations";
import WelcomeAboard from "@/components/pages/hotels-test/WelcomeAboard/page";
import WhatNew from "@/components/pages/hotels-test/WhatNew";
import PropertiesAtAGlance from "@/components/pages/hotels-test/PropertiesAtAGlance";
import HotelsInfo from "@/components/pages/hotels-test/HotelsInfo";

type Props = {};

async function page({}: Props) {
  const t = await getTranslations("HotelsTestPage.TopHotels");

  return (
    <section className="relative">
      <FloatingSideActions rounded />
      <HotelsTestHero />

      <section className="relative z-0 min-w-0 overflow-x-clip md:-mt-16 md:rounded-t-[32px] bg-white py-6 md:py-12">
        <WelcomeAboard />
        <WhatNew />
        <PriceMatch />
        <TopHotels title={t("title1")} />
        <TopHotels title={t("title2")} />
        <TopHotels title={t("title3")} />
        <PropertiesAtAGlance />
        <HotelsInfo />
        <Recommendations />
      </section>
    </section>
  );
}

export default page;
