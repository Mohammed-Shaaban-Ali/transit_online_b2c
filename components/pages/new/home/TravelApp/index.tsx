import React from "react";
import Image from "next/image";

import SeeImage from "@/public/images/new_hone/see.png";
import qrcodeImage from "@/public/images/flights/Qrcode.png";
import iosImage from "@/public/images/flights/ios.png";
import androidImage from "@/public/images/flights/android.png";

import heroSection from "@/public/images/new_hone/heroSection.webp";

type Props = {};

function TravelApp({}: Props) {
  return (
    <section className="relative w-full h-[400px] overflow-hidden">
      <Image
        src={heroSection}
        alt="heroSection"
        fill
        className="object-cover "
      />
      {/* overlay */}
      <div
        className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent
      backdrop-blur-xs
      "
      ></div>
      <div className="h-96 w-52 bg-primary rounded-r-full absolute -left-32 top-1/2 -translate-y-1/2 overflow-hidden"></div>
      <div className="h-96 w-[400px] bg-red-50 rounded-l-full absolute right-0 top-1/2 -translate-y-1/2 overflow-hidden">
        <Image src={SeeImage} alt="SeeImage" fill className="object-cover" />
      </div>

      {/* contant */}

      <div className="container relative z-10 mx-auto max-w-[900px]! px-4 py-10 text-white md:py-12 lg:py-14">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex w-full max-w-xl flex-col gap-5 lg:max-w-none lg:flex-1">
            <h2 className="text-center text-3xl font-bold leading-tight md:text-4xl lg:text-start">
              Your all-in-one travel app
            </h2>

            <div
              className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full 
            bg-primary w-fit
            px-4 py-2.5 text-[16px]  backdrop-blur-sm lg:justify-start text-white font-bold "
            >
              <span className="inline-flex items-center gap-1.5 font-medium">
                App-only deals
              </span>
              <span className="inline-flex items-center gap-1.5 font-medium">
                Easy trip planning
              </span>
            </div>

            <div
              className="flex w-full max-w-2xl flex-col items-stretch gap-6 
           p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6"
            >
              <div className="flex justify-center sm:justify-start">
                <div
                  className="relative h-[112px] w-[112px] shrink-0 overflow-hidden  bg-white p-1.5
                  sm:h-[140px] sm:w-[140px]"
                >
                  <Image
                    src={qrcodeImage}
                    alt="QR code to download the app"
                    fill
                    className="object-contain p-0.5"
                    sizes="140px"
                  />
                </div>
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div className="grid grid-cols-3 divide-x divide-white/40">
                  <div className="px-2 text-start first:ps-0 ">
                    <p className="text-xl font-bold leading-none tracking-tight sm:text-3xl md:text-4xl">
                      1.8M+
                    </p>
                    <p className="mt-1.5 text-[11px] text-white/95 sm:text-sm">
                      Daily users
                    </p>
                  </div>
                  <div className="px-4 text-start ">
                    <p className="text-xl font-bold leading-none tracking-tight sm:text-3xl md:text-4xl">
                      150K+
                    </p>
                    <p className="mt-1.5 text-[11px] text-white/95 sm:text-sm">
                      Daily downloads
                    </p>
                  </div>
                  <div className="px-8 text-start last:pe-0 ">
                    <p className="text-xl font-bold leading-none tracking-tight sm:text-3xl md:text-4xl">
                      4.7
                    </p>
                    <p className="mt-1.5 text-[11px] text-white/95 sm:text-sm">
                      Rating
                    </p>
                  </div>
                </div>

                <div
                  className="mx-auto grid max-w-[140px] grid-cols-2 gap-2.5 sm:mx-0 sm:max-w-none 
                sm:grid-cols-3 sm:gap-3"
                >
                  <a
                    href="#"
                    className="block min-w-0 transition-opacity hover:opacity-90"
                    aria-label="Download on the App Store"
                  >
                    <Image
                      src={iosImage}
                      alt=""
                      className="h-auto w-full"
                      width={140}
                      height={40}
                    />
                  </a>
                  <a
                    href="#"
                    className="block min-w-0 transition-opacity hover:opacity-90"
                    aria-label="Get it on Google Play"
                  >
                    <Image
                      src={androidImage}
                      alt=""
                      className="h-auto w-full"
                      width={140}
                      height={40}
                    />
                  </a>
                </div>

                <p className="text-start text-xs leading-snug text-white/90 sm:text-sm">
                  Scan the QR code to download the app
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TravelApp;
