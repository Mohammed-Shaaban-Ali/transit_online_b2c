"use client";

import { Button } from "@/components/ui/button";
import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import Image from "next/image";
import { MdOutlineFilterAltOff } from "react-icons/md";
import { useTranslations } from "next-intl";

const NoHotelsFound = () => {
  const t = useTranslations("HotelsList.NoHotelsFound");
  const { resetFilters } = useHotelFilterRedux();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="mb-5">
        <div className="w-48 h-48 bg-primary-light rounded-full flex items-center justify-center">
          <span className="text-[100px]">🏨</span>
        </div>
      </div>
      <h3 className="text-22 font-bold mb-2">{t("title")}</h3>
      <p className="text-16 text-center text-gray-600 mb-5">
        {t("description")}
      </p>
      <Button
        onClick={resetFilters}
        className="flex items-center gap-2 h-12 w-[150px] justify-center items-cente rounded-fullr"
        size="lg"
      >
        <MdOutlineFilterAltOff size={20} />
        <span>{t("resetFilters")}</span>
      </Button>
    </div>
  );
};

export default NoHotelsFound;
