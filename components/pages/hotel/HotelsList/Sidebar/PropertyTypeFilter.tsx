"use client";

import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { useState } from "react";
import Checkbox from "@/components/shared/form/Checkbox";
import { useTranslations } from "next-intl";

type PropertyType = {
  id: string;
  text: string;
  count: string;
};

type Props = {
  propertyTypes: PropertyType[];
};

const PropertyTypeFilter = (props: Props) => {
  const t = useTranslations("HotelsList.Filters");
  const { propertyTypes } = props;
  const { selectedPropertyTypes, togglePropertyType } = useHotelFilterRedux();
  const [showAll, setShowAll] = useState(false);
  const initialVisibleCount = 8;
  const visiblePropertyTypes = showAll
    ? propertyTypes
    : propertyTypes?.slice(0, initialVisibleCount);
  return (
    <div className="flex flex-col gap-1">
      {visiblePropertyTypes?.map((propertyType) => {
        const isSelected = selectedPropertyTypes.includes(propertyType.id);
        return (
          <Checkbox
            key={propertyType.id}
            name={propertyType.id}
            checked={isSelected}
            onChange={() => togglePropertyType(propertyType.id)}
            label={propertyType.text}
            count={propertyType.count}
          />
        );
      })}
      {propertyTypes?.length > initialVisibleCount && (
        <button
          className="flex items-center gap-2 text-primary font-medium mt-2 hover:underline
          cursor-pointer
          "
          onClick={() => setShowAll(!showAll)}
        >
          <span>{showAll ? t("showLess") : t("showMore")}</span>
        </button>
      )}
    </div>
  );
};

export default PropertyTypeFilter;
