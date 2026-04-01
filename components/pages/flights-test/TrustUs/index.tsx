import React from "react";
import { IoChevronForward } from "react-icons/io5";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {};

const trustCardImages = [
  "https://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/popular.f23f85bcde.svg",
  "http://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/support.7f30d8f0e8.svg",
  "http://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/price.272bcf92d8.svg",
  "https://aw-s.tripcdn.com/modules/ibu/flight-online-web/font/rewards.659f252ca5.svg",
];

function TrustUs({}: Props) {
  const t = useTranslations("FlightsTestPage.TrustUs");

  const trustCards = [
    {
      id: 1,
      title: t("card1Title"),
      description: t("card1Description"),
      image: trustCardImages[0],
    },
    {
      id: 2,
      title: t("card2Title"),
      description: t("card2Description"),
      image: trustCardImages[1],
    },
    {
      id: 3,
      title: t("card3Title"),
      description: t("card3Description"),
      image: trustCardImages[2],
    },
    {
      id: 4,
      title: t("card4Title"),
      description: t("card4Description"),
      image: trustCardImages[3],
    },
  ];

  return (
    <div className="container max-w-[1200px]! mx-auto py-4 md:py-7">
      <div className="mb-6 flex flex-col items-start gap-2 md:flex-row md:items-start md:justify-between">
        <h2 className="text-[28px] font-bold leading-tight ">{t("title")}</h2>
        <button className="flex items-center gap-1 text-lg cursor-pointer  text-black/60">
          {t("registerNow")}
          <IoChevronForward className="rtl:rotate-180" />
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
