import FlightsTestHero from "@/components/pages/flights-test/FlightsTestHero";
import PartnerAirlines from "@/components/pages/flights-test/PartnerAirlines";
import TrustUs from "@/components/pages/flights-test/TrustUs";
import Discover from "@/components/pages/flights-test/Discover";
import WhyBook from "@/components/pages/flights-test/WhyBook";
import HowToBook from "@/components/pages/flights-test/HowToBook";
import Recommended from "@/components/pages/flights-test/Recommended";
import Banner from "@/components/pages/flights-test/Banner";
import TrendingNow from "@/components/pages/flights-test/TrendingNow";
import FloatingSideActions from "@/components/pages/flights-test/FloatingSideActions";

type Props = {};

function page({}: Props) {
  return (
    <section className="relative">
      <FloatingSideActions />
      <FlightsTestHero />

      <section className="relative z-0 md:-mt-16 md:rounded-t-[32px] bg-[#f9f9f9] py-12">
        <div className="h-[2000px]"></div>
      </section>
    </section>
  );
}

export default page;
