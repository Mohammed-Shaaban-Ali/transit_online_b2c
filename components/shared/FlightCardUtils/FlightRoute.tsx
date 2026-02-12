"use client";
import { useState } from "react";
import {
    IoIosArrowDown,
    IoIosCheckmarkCircle,
    IoIosCloseCircle,
} from "react-icons/io";
import Image from "next/image";
import { useFlightUtils } from "@/hooks/useFlightUtils";
import { FlightDirection } from "@/types/flightTypes";
import { useTranslations } from "next-intl";
import {
    FlightData,
    FlightLegsData,
} from "@/components/shared/FlightCardUtils";
import { FlightBookingData } from "@/components/pages/flights/FlightBookingPage";

export const FlightRoute = ({
    flight,
    item,
    isReturn,
}: {
    flight: FlightDirection;
    item: FlightBookingData;
    isReturn: boolean;
}) => {
    const t = useTranslations("FlightCard");

    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const { formatTime, formatDuration, formatDate } = useFlightUtils();

    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };

    // Get baggage from selected offer
    const getBaggageInfo = () => {
        const baggagesArray =
            item.selectedOffer?.baggages_text ||
            item.fareData?.data?.fare_detail?.baggages_text ||
            [];

        const cabinBaggagesArray =
            item.selectedOffer?.cabin_baggages_text ||
            item.fareData?.data?.fare_detail?.cabin_baggages_text ||
            [];

        if (isReturn) {
            return {
                checkedBaggage:
                    baggagesArray.length > 1
                        ? baggagesArray[baggagesArray.length - 1]
                        : baggagesArray[0] || null,
                cabinBaggage:
                    cabinBaggagesArray.length > 1
                        ? cabinBaggagesArray[cabinBaggagesArray.length - 1]
                        : cabinBaggagesArray[0] || null,
            };
        } else {
            return {
                checkedBaggage: baggagesArray[0] || null,
                cabinBaggage: cabinBaggagesArray[0] || null,
            };
        }
    };

    const baggageInfo = getBaggageInfo();
    return (
        <div className="flex flex-col gap-3">
            {/* Compact View  */}
            <div className={`flex flex-row items-center gap-4 sm:gap-8 py-4 sm:py-0`}>
                {/* Airline */}
                <div className="flex-col items-center md:max-w-[140px] w-full hidden md:flex">
                    <Image
                        src={flight?.legs?.[0]?.airline_info?.logo || ""}
                        alt={flight?.legs?.[0]?.airline_info?.carrier_code}
                        className="w-10 h-10 object-contain"
                        width={100}
                        height={100}
                    />
                    <p className="text-14 font-medium mt-1 text-center">
                        {flight?.legs?.[0]?.airline_info?.carrier_name}{" "}
                        <span className="text-gray-500 text-14">
                            ({flight?.legs?.[0]?.flight_number})
                        </span>
                    </p>
                </div>
                {/* Flight Route */}
                <div className="flex-1 min-w-0 w-full md:w-auto">
                    <div className="flex items-center gap-5 relative">
                        <FlightData
                            date={flight?.legs?.[0]?.departure_info?.date || ""}
                            airportCode={
                                flight?.legs?.[0]?.departure_info?.airport_code || ""
                            }
                        />
                        <FlightLegsData legs={flight?.legs || []} />
                        <FlightData
                            date={
                                flight?.legs?.[flight?.legs?.length - 1]?.arrival_info?.date ||
                                ""
                            }
                            airportCode={
                                flight?.legs?.[flight?.legs?.length - 1]?.arrival_info
                                    ?.airport_code || ""
                            }
                        />
                    </div>
                </div>

                {/* Toggle Button */}
                <div
                    className="flex items-center justify-center cursor-pointer"
                    onClick={toggleAccordion}
                >
                    <IoIosArrowDown
                        className={`text-gray-500 text-lg cursor-pointer transition-transform duration-700 ${isAccordionOpen ? "rotate-180" : ""
                            }`}
                    />
                </div>
            </div>

            {/* Expanded View - Accordion Content */}
            <div
                className={`flex flex-col overflow-hidden transition-all duration-700 ${isAccordionOpen
                    ? "max-h-[2000px] opacity-100 ms-4"
                    : "max-h-0 opacity-0"
                    }`}
            >
                {/* Detailed Flight */}
                <div className="mt-2">
                    {flight?.legs?.map((leg: any, index: number) => (
                        <div key={index} className="mb-4 last:mb-0">
                            <div className="flex gap-2 h-[148px]">
                                {/* Left - Times */}
                                <div className="flex flex-col gap-2 justify-between items-center">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-14 font-medium">
                                            {formatTime(leg?.departure_info?.date || "")}
                                        </span>
                                        <span className="text-10 text-gray-500 -mt-1.5 text-center">
                                            {formatDate(leg?.departure_info?.date || "")}
                                        </span>
                                    </div>
                                    <span className="text-12 text-gray-600 ">
                                        {formatDuration(
                                            leg?.time_info?.leg_duration_time_minute || 0
                                        )}
                                    </span>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-14 font-medium">
                                            {formatTime(leg?.arrival_info?.date || "")}
                                        </span>
                                        <span className="text-10 text-gray-500 -mt-1.5 text-center">
                                            {formatDate(leg?.arrival_info?.date || "")}
                                        </span>
                                    </div>
                                </div>

                                {/* Center - Timeline */}
                                <div className="flex flex-col items-center">
                                    <div className="w-3.5 h-3.5 bg-white border-2 border-primary rounded-full"></div>
                                    <div className="h-24 w-0.5 bg-primary"></div>
                                    <div className="w-3.5 h-3.5 bg-primary rounded-full"></div>
                                </div>

                                {/* Right - Airports and Airline */}
                                <div className="flex flex-col gap-2 justify-between">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="text-14 font-medium">
                                            <span className="text-12">
                                                {leg?.departure_info?.airport_code}
                                            </span>{" "}
                                            {leg?.departure_info?.airport_name}
                                        </div>
                                        <span className="text-13 -mt-1.5">
                                            {leg?.departure_info?.city_name}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md w-full ">
                                        <div className="min-w-6 h-6 bg-white rounded-sm p-0.5 relative overflow-hidden">
                                            <Image
                                                src={leg?.airline_info?.logo || ""}
                                                alt="airline logo"
                                                width={24}
                                                height={24}
                                                className="object-cover"
                                            />
                                        </div>
                                        <span className="text-12 text-gray-500">
                                            {leg?.airline_info?.carrier_name}
                                        </span>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <div className="text-14 font-medium">
                                            <span className="text-12">
                                                {leg?.arrival_info?.airport_code}
                                            </span>{" "}
                                            {leg?.arrival_info?.airport_name}
                                        </div>
                                        <span className="text-13 -mt-1.5">
                                            {leg?.arrival_info?.city_name}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Transfer Time */}
                            {index !== flight?.legs?.length - 1 && (
                                <div className="flex items-center gap-2 my-3 bg-amber-100 p-2 rounded-md ">
                                    <span className="text-12 ">
                                        {t("airportStopover")}· {t("duration")}:{" "}
                                        {formatDuration(
                                            leg?.time_info?.wait_time_in_minute_before_next_leg || 0
                                        )}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex flex-col gap-2.5 border-t border-gray-300/70 pt-3">
                        {/* Cabin Baggage */}
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-md flex items-center justify-center 
                                    ${baggageInfo.cabinBaggage != "Unavailable" && baggageInfo.cabinBaggage != "غير متاح"
                                        ? "bg-green-100 border border-green-400"
                                        : "bg-red-100 border border-red-400"
                                    }`}
                            >
                                {baggageInfo.cabinBaggage != "Unavailable" && baggageInfo.cabinBaggage != "غير متاح" ? (
                                    <IoIosCheckmarkCircle className="text-green-500 text-lg" />
                                ) : (
                                    <IoIosCloseCircle className="text-red-500 text-lg border border-red-500" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-14 font-medium text-gray-600">
                                    {t("cabinBaggage")}
                                </span>
                                <span className="text-12 text-gray-500 -mt-1">
                                    {baggageInfo.cabinBaggage || t("unavailable")}
                                </span>
                            </div>
                        </div>
                        {/* Checked Baggage */}
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-8 h-8 rounded-md flex items-center justify-center 
                                    ${baggageInfo.checkedBaggage != "Unavailable" && baggageInfo.checkedBaggage != "غير متاح"
                                        ? "bg-green-100 border border-green-400"
                                        : "bg-red-100 border border-red-400"
                                    }`}
                            >
                                {baggageInfo.checkedBaggage != "Unavailable" && baggageInfo.checkedBaggage != "غير متاح" ? (
                                    <IoIosCheckmarkCircle className="text-green-500 text-lg" />
                                ) : (
                                    <IoIosCloseCircle className="text-red-500 text-lg" />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-14 font-medium text-gray-600">
                                    {t("checkedBaggage")}
                                </span>
                                <span className="text-12 text-gray-500 -mt-1">
                                    {baggageInfo.checkedBaggage}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
