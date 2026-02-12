"use client";

import React from "react";
import { FaCheck, FaSuitcase, FaBriefcase } from "react-icons/fa";
import { FlightOffer } from "@/types/fareTypes";
import { Button } from "@/components/ui/button";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";

interface OfferCardProps {
  offer: FlightOffer;
  isSelected: boolean;
  onSelect: () => void;
  displayPrice?: number | string;
  isReturnPhase?: boolean;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  isSelected,
  onSelect,
  displayPrice,
  isReturnPhase = false,
}) => {
  const t = useTranslations("OfferCard");
  const getBaggageInfo = () => {
    const cabinBag = "1 Bage (7 Kg)"
    // isReturnPhase
    // ? offer.cabin_baggages_text?.[offer.cabin_baggages_text.length - 1]
    // : offer.cabin_baggages_text?.[0];
    const checkedBag = isReturnPhase
      ? offer.baggages_text?.[offer.baggages_text.length - 1]
      : offer.baggages_text?.[0];
    return {
      cabin: cabinBag,
      checked: checkedBag,
    };
  };

  const baggage = getBaggageInfo();

  // Get package name
  const getPackageName = () => {
    if (isReturnPhase) {
      return (
        offer.offer_details[offer.offer_details.length - 1]?.name ||
        offer.offer_details[offer.offer_details.length - 1]
          ?.descriptions?.[0] ||
        t("returnPackage")
      );
    }
    return (
      offer.offer_details[0]?.name ||
      offer.offer_details[0]?.descriptions?.[0] ||
      t("travelPackage")
    );
  };

  const packageName = getPackageName();

  return (
    <div
      className={`bg-white border-2 rounded-xl relative  w-full cursor-pointer
        p-4 flex flex-col h-full
        ${isSelected ? "border-primary" : "border-gray-200"}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
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
      {/* name and price */}
      <div className="flex flex-col items-center justify-center gap-0">
        <h3 className="font-bold text-22">{packageName}</h3>
        {/* Price */}
        <div
          className={`flex items-center gap-1 text-28 font-bold text-primary 
            ${!isReturnPhase ? "rtl:flex-row-reverse" : ""}
            `}
        >
          <CurrencySymbol size="lg" />


          {displayPrice !== undefined
            ? (displayPrice)
            : formatePrice(offer.minimum_offer_price)}
        </div>
      </div>

      {/* select button */}
      <Button
        className={` 
            h-11 rounded-full mt-3
            ${isSelected
            ? "bg-primary text-white hover:bg-primary/90 "
            : "bg-primary/15 text-primary hover:bg-primary/30"
          }`}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {t("selectPackage")}
      </Button>

      {/* Travel Essentials Section */}
      <div className="mt-6 mb-2 ">
        <h4 className="text-14  text-gray-600 mb-3">{t("travelEssentials")}</h4>

        <div className="flex flex-col gap-4">
          {/* Cabin Baggage */}
          <div className="flex items-start gap-2.5">
            <div className={`shrink-0 rounded-full p-3 bg-primary/10 `}>
              <FaBriefcase className="text-primary" size={18} />
            </div>
            <div className="grow">
              <div className="text-14 font-medium ">{t("cabinBaggage")}</div>
              <div className="text-12 font-normal text-gray-500">
                {baggage.cabin}
              </div>
            </div>
          </div>

          {/* Checked Baggage */}
          <div className="flex items-start gap-2.5">
            <div className={`shrink-0 rounded-full p-3 bg-secondary/10`}>
              <FaSuitcase className="text-secondary" size={18} />
            </div>
            <div className="grow">
              <div className="text-14 font-medium ">{t("checkedBaggage")}</div>
              <div className="text-12 font-normal text-gray-500">
                {baggage.checked}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
