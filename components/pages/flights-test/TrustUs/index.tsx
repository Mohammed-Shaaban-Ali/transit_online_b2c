import React from "react";
import { FaMedal } from "react-icons/fa6";
import { MdSupportAgent, MdLocalOffer } from "react-icons/md";
import { TbCurrencyDollar } from "react-icons/tb";
import { IoChevronForward } from "react-icons/io5";
import Image from "next/image";

type Props = {};

const trustCards = [
  {
    id: 1,
    title: "Travelers' favorite",
    description: "Join over 300 million travelers worldwide who fly with us",
    image:
      "https://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/popular.f23f85bcde.svg",
  },
  {
    id: 2,
    title: "Customer support available 24/7",
    description:
      "Get assistance from a Trip.com customer support agent in approximately 30 seconds. Anytime, anywhere.",
    image:
      "http://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/support.7f30d8f0e8.svg",
  },
  {
    id: 3,
    title: "Transparent pricing",
    description:
      "No surprises. All taxes and fees included, what you see is what you pay.",
    image:
      "http://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/price.272bcf92d8.svg",
  },
  {
    id: 4,
    title: "Earn double rewards",
    description:
      "Earn both airline miles and Trip Coins to use on your next trip",
    image:
      "https://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/rewards.659f252ca5.svg",
  },
];

function TrustUs({}: Props) {
  return (
    <div className="container max-w-[1200px]! mx-auto py-4 md:py-7">
      <div className="mb-6 flex flex-col items-start gap-2 md:flex-row md:items-start md:justify-between">
        <h2 className="text-[28px] font-bold leading-tight ">
          Trust us to take you there
        </h2>
        <button className="flex items-center gap-1 text-lg cursor-pointer  text-black/60">
          Register now
          <IoChevronForward className="size-5s" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {trustCards.map((card) => {
          return (
            <article
              key={card.id}
              className="rounded-xl border border-gray-300/60 p-4"
            >
              <div className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-white">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={48}
                  height={48}
                />
              </div>
              <h3 className="text-[18px] font-mediums text-black leading-tight ">
                {card.title}
              </h3>
              <p className="mt-2 text-[14px] text-black/50">
                {card.description}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default TrustUs;
