"use client";

import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { useTranslations } from "next-intl";

const SearchBox = () => {
  const t = useTranslations("HotelsList.SearchBox");
  const { hotelName, setHotelName } = useHotelFilterRedux();

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder={t("placeholder")}
        value={hotelName}
        onChange={(e) => setHotelName(e.target.value)}
        className="w-full px-4 py-2  rounded-full
        bg-white h-11
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
    </div>
  );
};

export default SearchBox;
