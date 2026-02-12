"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";
import { useTranslations } from "next-intl";

type Props = Record<string, never>;

function HeaderShared({
  title,
  subtitle,
  onClickPrev,
  onClickNext,
  ViewMore,
  description,
  isBeginning,
  isEnd,
}: {
  title: string;
  subtitle?: string;
  onClickPrev?: () => void;
  onClickNext?: () => void;
  ViewMore?: boolean;
  description?: string;
  isBeginning?: boolean;
  isEnd?: boolean;
}) {
  const t = useTranslations("Components.HeaderShared");
  return (
    <div className="flex items-end justify-between gap-3 mb-5 flex-wrap ">
      <div className="flex flex-col items-start gap-1">
        {/* <h2 className="text-40 font-bold block rtl:flex rtl:flex-row-reverse gap-2 leading-tight "> */}
        <h2 className="text-40 font-bold flex rtl:flex-row-reverse gap-2 leading-tight flex-wrap ">
          {title}
          {subtitle && <span className="text-primary  ">{subtitle}</span>}
        </h2>
        {description && (
          <p className="text-16 text-gray-500 font-medium ">{description}</p>
        )}
      </div>

      {onClickPrev && onClickNext && (
        <div className="flex items-center gap-2.5 ms-auto">
          <Button
            onClick={onClickPrev}
            variant={isBeginning ? "outline-primary" : "default"}
            size="icon"
            className="rounded-full"
            disabled={isBeginning}
          >
            <IoIosArrowBack className="size-5 rtl:rotate-180 " />
          </Button>
          <Button
            onClick={onClickNext}
            variant={isEnd ? "outline-primary" : "default"}
            size="icon"
            className="rounded-full"
            disabled={isEnd}
          >
            <IoIosArrowForward className="size-5 rtl:rotate-180 " />
          </Button>
        </div>
      )}
      {ViewMore && (
        <Button
          onClick={onClickNext}
          variant="default"
          size="lg"
          className="rounded-full font-bold ms-auto"
        >
          {t("viewMore")}
          <IoArrowForward className="size-5 rtl:rotate-180" />
        </Button>
      )}
    </div>
  );
}

export default HeaderShared;
