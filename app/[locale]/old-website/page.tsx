import { HomeHero } from "@/components/pages/home/Hero";
import Lastsearched from "@/components/pages/home/Lastsearched";
import OurPackages from "@/components/pages/home/OurPackages";
import PopularDestinations from "@/components/pages/home/PopularDestinations";
import RecommendedHotel from "@/components/pages/home/RecommendedHotel";

import "swiper/css";
import "swiper/css/navigation";
export default async function HomePage() {
  return (
    <>
      <HomeHero />
      <section className="bg-primary-light/15">
        <section className="container mx-auto">
          <Lastsearched />
          <PopularDestinations />
          <RecommendedHotel />
          <OurPackages />
        </section>
      </section>
    </>
  );
}
