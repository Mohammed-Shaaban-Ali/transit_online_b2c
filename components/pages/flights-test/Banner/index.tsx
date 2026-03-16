import Image from "next/image";
import bannerImage from "@/public/images/flights/banner-bg.png";
import qrcodeImage from "@/public/images/flights/Qrcode.png";
import iosImage from "@/public/images/flights/ios.png";
import androidImage from "@/public/images/flights/android.png";
import flightCardImage from "@/public/images/flights/flight-card.png";
import { FaRegClock, FaRoute } from "react-icons/fa6";
import { GiCommercialAirplane } from "react-icons/gi";
type Props = {};

function Banner({}: Props) {
  const bannerFeatures = [
    {
      id: 1,
      icon: FaRoute,
      text: "Track over 110,000 global flights in real time",
    },
    {
      id: 2,
      icon: FaRegClock,
      text: "Easily navigate airports with check-in counter, boarding gate, and baggage claim info",
    },
    {
      id: 3,
      icon: GiCommercialAirplane,
      text: "Stay up-to-date with flight alerts and gate changes to keep your trip on track",
    },
  ];

  return (
    <section className="relative w-full my-6">
      <div className="relative min-h-[400px] overflow-hidden">
        <Image src={bannerImage} alt="banner" fill className="object-cover" />

        <div className="absolute left-[10%] top-[24px] z-10 hidden lg:block lg:w-[280px] xl:w-[330px]">
          <Image
            src={flightCardImage}
            alt="Flight card"
            className="h-auto w-full"
            priority
          />
        </div>

        <div
          className="relative z-20 mx-auto flex min-h-[400px] w-full max-w-[1200px]! items-center 
        justify-center px-5 py-5 md:px-8 lg:px-10"
        >
          <div className="flex w-full max-w-[980px] items-start justify-between gap-6  lg:pl-[220px]">
            <div className="max-w-[780px] text-white">
              <h2 className="text-[28px] font-bold leading-tight ">
                Get free flight status updates on the go
              </h2>

              <ul className="mt-8 flex flex-col gap-6">
                {bannerFeatures.map((feature) => (
                  <li key={feature.id} className="flex items-start gap-5">
                    <feature.icon className="mt-1 size-6 shrink-0 text-white/85" />
                    <p className="text-[20px] font-medium leading-tight text-white/95 ">
                      {feature.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden min-w-[150px] shrink-0 items-center lg:flex lg:flex-col lg:gap-6">
              <Image
                src={qrcodeImage}
                alt="QR code"
                className="w-[120px] h-auto"
              />
              <Image
                src={iosImage}
                alt="Download on App Store"
                className="w-[120px] h-auto"
              />
              <Image
                src={androidImage}
                alt="Get it on Google Play"
                className="w-[120px] h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Banner;
