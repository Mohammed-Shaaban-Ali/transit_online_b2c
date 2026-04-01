"use client";

import { useState } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useTranslations } from "next-intl";

type Props = {};

function HowToBook({}: Props) {
  const [openItems, setOpenItems] = useState<number[]>([1]);
  const t = useTranslations("FlightsTestPage.HowToBook");

  const howToBookItems = [
    { id: 1, title: t("item1Title"), content: t("item1Content") },
    { id: 2, title: t("item2Title"), content: t("item2Content") },
    { id: 3, title: t("item3Title"), content: t("item3Content") },
    { id: 4, title: t("item4Title"), content: t("item4Content") },
    { id: 5, title: t("item5Title"), content: t("item5Content") },
    { id: 6, title: t("item6Title"), content: t("item6Content") },
    { id: 7, title: t("item7Title"), content: t("item7Content") },
    { id: 8, title: t("item8Title"), content: t("item8Content") },
    { id: 9, title: t("item9Title"), content: t("item9Content") },
  ];

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  return (
    <section className="container max-w-[1200px]! mx-auto py-7">
      <h2 className="mb-6 text-[28px] font-bold leading-tight ">
        {t("title")}
      </h2>

      <div className="rounded-lg  bg-white px-6 py-2.5 shadow-[0px_8px_16px_0px_rgba(15,41,77,0.08)] transition-all duration-300">
        {howToBookItems.map((item, index) => {
          const isOpen = openItems.includes(item.id);

          return (
            <article
              key={item.id}
              className={
                index !== howToBookItems.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }
            >
              <button
                type="button"
                onClick={() => toggleItem(item.id)}
                className="group flex w-full items-center justify-between gap-4 py-4 text-start cursor-pointer"
              >
                <span
                  className="text-[16px] font-bold cursor-pointer 
                leading-tight text-black  group-hover:text-primary
                group-hover:translate-x-2 transition-all duration-300 
                "
                >
                  {item.title}
                </span>
                {isOpen ? (
                  <IoChevronUp
                    className="size-4 shrink-0 text-black/60 
                   group-hover:text-primary group-hover:-translate-x-2 transition-all duration-300 
"
                  />
                ) : (
                  <IoChevronDown
                    className="size-4 shrink-0 text-black/60 
                   group-hover:text-primary group-hover:translate-x-2 transition-all duration-300 
"
                  />
                )}
              </button>

              {isOpen && (
                <p className="pb-4 text-[14px] leading-6 text-black/60">
                  {item.content}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default HowToBook;
