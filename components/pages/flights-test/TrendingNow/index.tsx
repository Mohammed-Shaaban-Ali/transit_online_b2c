import Image from "next/image";
import TrendingNowImage from "@/public/images/flights/TrendingNow.webp";

type Props = {};

function TrendingNow({}: Props) {
  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight">
        Get a glimpse of what's trending now
      </h2>

      <div className="grid grid-cols-1 gap-6 overflow-hidden  md:grid-cols-[62%_38%]">
        <div className="relative min-h-[300px] md:min-h-[660px]  rounded-md overflow-hidden">
          <Image
            src={TrendingNowImage}
            alt="Kids enjoying a flight"
            fill
            className="object-cover"
          />

          <div className="absolute left-4 top-4 rounded-sm bg-[rgba(46,131,185,0.4)] px-3 py-2 md:left-5 md:top-32">
            <p className="text-[28px] font-bold leading-tight text-white ">
              Wonderful things are happening
            </p>
          </div>
        </div>

        <div className="relative flex min-h-[300px] items-end justify-center bg-blue-50 p-6 md:min-h-[510px] md:p-8 rounded-md overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_20%,rgba(201,214,255,0.42)_0%,transparent_42%),radial-gradient(circle_at_75%_45%,rgba(211,223,255,0.36)_0%,transparent_45%),radial-gradient(circle_at_55%_85%,rgba(225,232,255,0.5)_0%,transparent_35%)]" />

          <button
            type="button"
            className="relative z-10 mb-4 min-w-[120px] rounded-sm bg-blue-500 px-8 py-3 text-[20px] 
            font-bold text-white transition-colors duration-200 hover:bg-[#1f4bd1] md:mb-6 "
          >
            Explore the world
          </button>
        </div>
      </div>
    </section>
  );
}

export default TrendingNow;
