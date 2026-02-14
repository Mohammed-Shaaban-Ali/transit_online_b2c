"use client";

import { memo } from "react";

import { FlightDirection } from "@/types/flightTypes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MdOutlineFlight } from "react-icons/md";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import {
  FlightData,
  FlightLegsData,
} from "@/components/shared/FlightCardUtils";
import { formatePrice } from "@/utils/formatePrice";

interface FlightCardProps {
  flightData: FlightDirection;
  isSelected: boolean;
  onSelectDeparture?: (
    departureFareKey: string,
    departureData: FlightDirection
  ) => void;

  isReturn?: boolean;
  selectedDepartureData?: FlightDirection;
  inSheet?: boolean;
}

const FlightCard = memo<FlightCardProps>(
  ({
    flightData,
    isSelected,
    onSelectDeparture,
    isReturn,
    selectedDepartureData,
    inSheet,
  }) => {
    const t = useTranslations("FlightCard");

    const handleSelectDeparture = () => {
      if (onSelectDeparture) {
        const departureFareKey = flightData.fares?.[0]?.fare_key || "";
        onSelectDeparture(departureFareKey, flightData);
      }
    };

    return (
      <div
        onClick={handleSelectDeparture}
        className={`bg-white rounded-lg relative border md:p-4 p-4 pt-6 cursor-pointer transition-all duration-300
          shadow-sm sm:shadow-none
           ${isSelected
            ? "border-primary border-2 md:py-6 py-8 bg-primary-light/50!"
            : "border-gray-300 hover:border-gray-400 "
          }
          ${inSheet ? "border-primary  bg-primary-light/50!" : ""}
          `}
      >
        {isSelected && (
          <div className="absolute  top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div
              className="px-3 h-8 flex items-center justify-center bg-primary rounded
             text-white text-15 font-bold gap-1.5"
            >
              <FaRegCircleCheck size={16} fill="white" stroke="white" />
              {t("selected")}
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-start md:items-center  md:gap-8 gap-4">
          {/* Airline */}
          <div className=" flex-col items-center md:max-w-[140px] w-full hidden md:flex ">
            <Image
              src={flightData?.legs?.[0]?.airline_info?.logo || ""}
              alt={flightData?.legs?.[0]?.airline_info?.carrier_code}
              className="w-12 h-12 object-contain"
              width={100}
              height={100}
              objectFit="contain"
            />
            <p className="text-15 font-medium mt-1 text-center">
              {flightData?.legs?.[0]?.airline_info?.carrier_name}{" "}
              <span className="text-gray-500 text-14">
                ({flightData?.legs?.[0]?.flight_number})
              </span>
            </p>
          </div>
          {/* Flight Route */}
          <div className="flex-1 min-w-0 w-full md:w-auto">
            <div className="flex items-center sm:gap-5 gap-2 relative">
              <div className="text-center ">
                <FlightData
                  date={
                    flightData?.legs?.[0]?.departure_info?.date || ""
                  }
                  airportCode={
                    flightData?.legs?.[0]?.departure_info
                      ?.airport_code || ""
                  }
                />
              </div>
              <FlightLegsData legs={flightData?.legs || []} />
              <div className={`
                text-center 
                ${!inSheet ? "md:border-e md:pe-4 border-gray-300" : ""}
                `}>
                <FlightData
                  date={
                    flightData?.legs?.[
                      flightData?.legs?.length - 1
                    ]?.arrival_info?.date || ""
                  }
                  airportCode={
                    flightData?.legs?.[
                      flightData?.legs?.length - 1
                    ]?.arrival_info?.airport_code || ""
                  }
                />
              </div>
            </div>
          </div>
          {/* Price Section */}
          <div className="flex md:justify-end items-center gap-2 justify-between w-full md:w-auto border-t pt-2 md:border-none md:pt-0">
            <div className=" flex-col items-start  w-full flex md:hidden ">
              <Image
                src={flightData?.legs?.[0]?.airline_info?.logo || ""}
                alt={flightData?.legs?.[0]?.airline_info?.carrier_code}
                className="w-12 h-12 object-contain"
                width={100}
                height={100}
                objectFit="contain"
              />
              <p className="text-15 font-medium mt-1 ">
                {flightData?.legs?.[0]?.airline_info?.carrier_name}
                <span className="text-gray-500 text-14">
                  ({flightData?.legs?.[0]?.flight_number})
                </span>
              </p>
            </div>
            {!inSheet && (
              <div className="md:min-w-[160px] w-full md:w-auto flex flex-col items-end justify-center">
                <div className="text-14 flex items-center font-medium justify-center text-nowrap">
                  {t("totalPrice")}
                </div>
                <div className="text-24 font-bold mb-2 flex items-center rtl:flex-row-reverse">
                  <CurrencySymbol size="md" />
                  {isReturn
                    ? formatePrice(
                      flightData?.fares?.[0]?.fare_info?.fare_detail
                        ?.price_info?.total_fare +
                      Number(
                        selectedDepartureData?.fares?.[0]?.fare_info
                          ?.fare_detail?.price_info?.total_fare || 0
                      ) -
                      Number(
                        selectedDepartureData?.minimum_package_price || 0
                      )
                    )
                    : formatePrice(flightData?.minimum_package_price)}
                  {isReturn ? "+" : ""}
                </div>
                {!isSelected ? (
                  <Button className="rounded-full font-semibold md:h-10 h-9 gap-1 px-4!">
                    <MdOutlineFlight />
                    {t("chooseFlight")}
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

FlightCard.displayName = "FlightCard";

export default FlightCard;
