"use client";

import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import Checkbox from "@/components/shared/form/Checkbox";
import { useTranslations } from "next-intl";

type FacilityType = {
  id: string;
  text: string;
  count: string;
};

type Props = {
  facilities: FacilityType[];
};

const FacilityFilter = (props: Props) => {
  const t = useTranslations("HotelsList.Filters");
  const { facilities } = props;
  const { selectedFacilities, toggleFacility } = useHotelFilterRedux();
  const [showAll, setShowAll] = useState(false);

  const initialVisibleCount = 8;
  const visibleFacilities = showAll
    ? facilities
    : facilities?.slice(0, initialVisibleCount);

  return (
    <div className="flex flex-col gap-1">
      {visibleFacilities?.map((facility) => {
        const isSelected = selectedFacilities.includes(facility.id);
        return (
          <Checkbox
            key={facility.id}
            name={facility.id}
            checked={isSelected}
            onChange={() => toggleFacility(facility.id)}
            label={facility.text}
            count={facility.count}
          />
        );
      })}

      {facilities && facilities.length > initialVisibleCount && (
        <button
          className="flex items-center gap-2 text-primary font-medium mt-2 hover:underline cursor-pointer"
          onClick={() => setShowAll(!showAll)}
        >
          <span>{showAll ? t("showLess") : t("showMore")}</span>
          {showAll ? (
            <FiChevronUp className="ml-1" />
          ) : (
            <FiChevronDown className="ml-1" />
          )}
        </button>
      )}
    </div>
  );
};

export default FacilityFilter;
