"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import Image1 from "@/public/images/new_hone/round1.webp";
import Image2 from "@/public/images/new_hone/round2.webp";
import Image3 from "@/public/images/new_hone/round3.webp";

type TripCard = {
  id: number;
  image: typeof Image1;
  title: string;
  author: string;
  views: string;
};

export default function Trip() {
  const t = useTranslations("NewPage.mobile.trip");
  const cardRow1: TripCard[] = [
    {
      id: 1,
      image: Image1,
      title: t("card1"),
      author: "国际行",
      views: "349",
    },
    {
      id: 2,
      image: Image2,
      title: t("card2"),
      author: "StellaDora",
      views: "4.8k",
    },
    {
      id: 3,
      image: Image3,
      title: t("card3"),
      author: "Thrive_234_Cook",
      views: "5k",
    },
    {
      id: 4,
      image: Image1,
      title: t("card4"),
      author: "FD. Cal 29",
      views: "963",
    },
    {
      id: 5,
      image: Image3,
      title: t("card4"),
      author: "FD. Cal 29",
      views: "963",
    },
  ];
  const cardRow2: TripCard[] = [
    {
      id: 2,
      image: Image2,
      title: t("card2"),
      author: "StellaDora",
      views: "4.8k",
    },
    {
      id: 3,
      image: Image3,
      title: t("card3"),
      author: "Thrive_234_Cook",
      views: "5k",
    },
    {
      id: 4,
      image: Image1,
      title: t("card4"),
      author: "FD. Cal 29",
      views: "963",
    },
    {
      id: 5,
      image: Image3,
      title: t("card4"),
      author: "FD. Cal 29",
      views: "963",
    },
    {
      id: 6,
      image: Image2,
      title: t("card4"),
      author: "FD. Cal 29",
      views: "963",
    },
  ];
  return (
    <section className="mt-8">
      <h2 className="mb-2.5 text-[16px] font-semibold leading-tight ">
        {t("title")}
      </h2>

      <div className="space-y-3">
        <div className="grid grid-cols-2 items-stretch gap-2.5">
          <div className="space-y-2.5">
            {cardRow1.map((card) => (
              <TripCard key={card.id} card={card} />
            ))}
          </div>
          <div className="space-y-2.5">
            {cardRow2.map((card) => (
              <TripCard key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TripCard({ card }: { card: TripCard }) {
  return (
    <article
      className="flex h-fit flex-col overflow-hidden rounded-3xl border
     border-gray-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
    >
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden">
        <Image
          src={card.image}
          alt={card.title}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col p-3 pb-4">
        <p className="line-clamp-2 text-[13px] font-medium leading-5 text-gray-900">
          {card.title}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2 text-[12px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <div className="size-5 rounded-full bg-gray-200"></div>
            <span className="truncate">{card.author}</span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1">
            <Eye className="size-3.5" />
            {card.views}
          </span>
        </div>
      </div>
    </article>
  );
}
