"use client";

import { useDispatch, useSelector } from "react-redux";
import { setTimeRange } from "@/redux/features/flights/flightFilterSlice";
import { RootState } from "@/redux/app/store";
import Image from "next/image";
import { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

// icons
import before6 from "@/public/images/6.png";
import between6and12 from "@/public/images/6_12.png";
import between12and18 from "@/public/images/12_18.png";
import after18 from "@/public/images/18.png";
interface TimeFilterProps {
  flightType?: "departure" | "return";
  fromCity?: string;
  toCity?: string;
}

type TimeSlot = {
  id: string;
  label: string;
  min: string;
  max: string;
  icon: StaticImageData;
};

const TimeFilter: React.FC<TimeFilterProps> = ({
  flightType = "departure",
  fromCity = "",
  toCity = "",
}) => {
  const t = useTranslations("TimeFilter");
  const dispatch = useDispatch();
  const { departureFilters, returnFilters } = useSelector(
    (state: RootState) => state.flightFilter
  );
  const filters = flightType === "departure" ? departureFilters : returnFilters;
  const timeRange = filters?.timeRange;

  // Define time slots
  const timeSlots: TimeSlot[] = [
    {
      id: "before-6am",
      label: t("before6am"),
      min: "00:00",
      max: "06:00",
      icon: before6,
    },
    {
      id: "6am-12pm",
      label: t("6am12pm"),
      min: "06:00",
      max: "12:00",
      icon: between6and12,
    },
    {
      id: "12pm-6pm",
      label: t("12pm6pm"),
      min: "12:00",
      max: "18:00",
      icon: between12and18,
    },
    {
      id: "after-6pm",
      label: t("after6pm"),
      min: "18:00",
      max: "23:59",
      icon: after18,
    },
  ];

  const isTimeSlotSelected = (
    slot: TimeSlot,
    type: "departure" | "arrival"
  ): boolean => {
    if (!timeRange) return false;

    if (type === "departure") {
      return (
        timeRange.departureMin === slot.min &&
        timeRange.departureMax === slot.max
      );
    } else {
      return (
        timeRange.arrivalMin === slot.min && timeRange.arrivalMax === slot.max
      );
    }
  };

  const handleTimeSlotClick = (
    slot: TimeSlot,
    type: "departure" | "arrival"
  ) => {
    const isSelected = isTimeSlotSelected(slot, type);

    if (isSelected) {
      // Deselect - reset to full day for this type
      const newDepartureMin =
        type === "departure" ? "00:00" : timeRange?.departureMin || "00:00";
      const newDepartureMax =
        type === "departure" ? "23:59" : timeRange?.departureMax || "23:59";
      const newArrivalMin =
        type === "arrival" ? "00:00" : timeRange?.arrivalMin || "00:00";
      const newArrivalMax =
        type === "arrival" ? "23:59" : timeRange?.arrivalMax || "23:59";

      // If both are reset to full day, set to null
      if (
        newDepartureMin === "00:00" &&
        newDepartureMax === "23:59" &&
        newArrivalMin === "00:00" &&
        newArrivalMax === "23:59"
      ) {
        dispatch(
          setTimeRange({
            timeRange: null,
            flightType,
          })
        );
      } else {
        dispatch(
          setTimeRange({
            timeRange: {
              departureMin: newDepartureMin,
              departureMax: newDepartureMax,
              arrivalMin: newArrivalMin,
              arrivalMax: newArrivalMax,
            },
            flightType,
          })
        );
      }
    } else {
      // Select this time slot
      if (type === "departure") {
        dispatch(
          setTimeRange({
            timeRange: {
              departureMin: slot.min,
              departureMax: slot.max,
              arrivalMin: timeRange?.arrivalMin || "00:00",
              arrivalMax: timeRange?.arrivalMax || "23:59",
            },
            flightType,
          })
        );
      } else {
        dispatch(
          setTimeRange({
            timeRange: {
              departureMin: timeRange?.departureMin || "00:00",
              departureMax: timeRange?.departureMax || "23:59",
              arrivalMin: slot.min,
              arrivalMax: slot.max,
            },
            flightType,
          })
        );
      }
    }
  };

  return (
    <div className="space-y-6 px-1">
      {/* Departure Time Section */}
      <div>
        <h6 className="text-base font-semibold text-gray-500  mb-2 ">
          {t("goingTimeFrom", {
            city: flightType === "departure" ? fromCity : toCity,
          })}
        </h6>
        <div className="grid grid-cols-2 gap-2.5">
          {timeSlots.map((slot) => {
            const isSelected = isTimeSlotSelected(slot, "departure");
            return (
              <TimeFilterItem
                key={`departure-${slot.id}`}
                isSelected={isSelected}
                onClick={() => handleTimeSlotClick(slot, "departure")}
                icon={slot.icon}
                label={slot.label}
              />
            );
          })}
        </div>
      </div>

      {/* Arrival Time Section */}
      <div>
        <h6 className="text-base font-semibold text-gray-500  mb-2 ">
          {t("arrivalTimeTo", {
            city: flightType === "departure" ? toCity : fromCity,
          })}
        </h6>
        <div className="grid grid-cols-2 gap-2.5">
          {timeSlots.map((slot) => {
            const isSelected = isTimeSlotSelected(slot, "arrival");
            return (
              <TimeFilterItem
                key={`arrival-${slot.id}`}
                isSelected={isSelected}
                onClick={() => handleTimeSlotClick(slot, "arrival")}
                icon={slot.icon}
                label={slot.label}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeFilter;

const TimeFilterItem = ({
  isSelected,
  onClick,
  icon,
  label,
}: {
  isSelected: boolean;
  onClick: () => void;
  icon: StaticImageData;
  label: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={`
                 cursor-pointer flex flex-col items-center justify-center gap-2 p-3 
                 rounded-md border transition-all duration-300
                  ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-400"
                  }
                `}
    >
      <div className="relative w-6 h-6">
        <Image
          src={icon}
          alt={label}
          width={24}
          height={24}
          className="object-contain"
        />
      </div>
      <span
        className={`text-sm font-medium ${
          isSelected ? "text-primary" : "text-gray-700"
        } transition-colors`}
      >
        {label}
      </span>
    </button>
  );
};
