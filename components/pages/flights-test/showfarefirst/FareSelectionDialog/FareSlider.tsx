"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Check, X } from "lucide-react";
import "swiper/css";
import type { FareOption } from "../data/flights";

type Props = {
  fares: FareOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

function FareCard({
  fare,
  isSelected,
  onSelect,
}: {
  fare: FareOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative h-full flex flex-col border-2 rounded-lg p-4 cursor-pointer transition-all select-none ${
        isSelected
          ? "border-primary shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[16px] font-bold ">{fare.cabinClass}</p>
          <p className="text-[14px] text-gray-500">{fare.fareType}</p>
        </div>
        <div
          className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
            isSelected ? "border-primary bg-primary" : "border-gray-300"
          }`}
        >
          {isSelected && (
            <Check size={11} className="text-white" strokeWidth={3} />
          )}
        </div>
      </div>

      <div className="space-y-4 flex-1">
        {/* Baggage */}
        <div>
          <p className="text-[14px] font-semibold text-gray-700 mb-1.5">
            Baggage
          </p>
          <ul className="space-y-1.5">
            <li className="flex items-start gap-1.5 text-[14px] text-gray-700">
              <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
              Personal item: <span className="font-semibold">Included</span>
            </li>
            <li
              className={`flex items-start gap-1.5 text-[14px] ${fare.baggage.carryOn ? "text-gray-700" : "text-gray-400"}`}
            >
              {fare.baggage.carryOn ? (
                <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
              ) : (
                <X size={13} className="text-gray-400 shrink-0 mt-0.5" />
              )}
              Carry-on baggage:{" "}
              <span
                className={`font-semibold ${!fare.baggage.carryOn ? "line-through" : ""}`}
              >
                {fare.baggage.carryOn || "Not included"}
              </span>
            </li>
            <li
              className={`flex items-start gap-1.5 text-[14px] ${fare.baggage.checked ? "text-gray-700" : "text-gray-400"}`}
            >
              {fare.baggage.checked ? (
                <Check size={13} className="text-green-500 shrink-0 mt-0.5" />
              ) : (
                <X size={13} className="text-gray-400 shrink-0 mt-0.5" />
              )}
              Checked baggage:{" "}
              <span
                className={`font-semibold ${!fare.baggage.checked ? "line-through" : ""}`}
              >
                {fare.baggage.checked || "Not included"}
              </span>
            </li>
          </ul>
        </div>

        {/* Flexibility */}
        <div>
          <p className="text-[14px] font-semibold text-gray-700 mb-1.5">
            Flexibility
          </p>
          <ul className="space-y-1.5">
            <li
              className={`flex items-center gap-1.5 text-[14px] ${fare.flexibility.refundable ? "text-gray-700" : "text-gray-400"}`}
            >
              {fare.flexibility.refundable ? (
                <Check size={13} className="text-green-500 shrink-0" />
              ) : (
                <X size={13} className="text-gray-400 shrink-0" />
              )}
              {fare.flexibility.refundable ? "Refundable" : "Non-refundable"}
            </li>
            <li
              className={`flex items-center gap-1.5 text-[14px] ${fare.flexibility.changeFee ? "text-gray-700" : "text-gray-400"}`}
            >
              {fare.flexibility.changeFee ? (
                <Check size={13} className="text-green-500 shrink-0" />
              ) : (
                <X size={13} className="text-gray-400 shrink-0" />
              )}
              {fare.flexibility.changeFee
                ? `Change fee: ${fare.flexibility.changeFee}`
                : "Changes not permitted"}
            </li>
          </ul>
        </div>

        {/* Other benefits */}
        {fare.otherBenefits && fare.otherBenefits.length > 0 && (
          <div>
            <p className="text-[14px] font-semibold text-gray-700 mb-1.5">
              Other benefits
            </p>
            <ul className="space-y-1.5">
              {fare.otherBenefits.map((benefit) => (
                <li
                  key={benefit}
                  className="text-[14px] text-gray-700 flex items-start gap-1.5"
                >
                  <span className="text-primary shrink-0 mt-0.5">✈</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Price footer */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        <p className="text-[17px] font-bold text-primary">
          {fare.currency}
          {fare.price}
        </p>
        <p className="text-[11px] text-gray-500">Round-trip</p>
      </div>

      {/* Selected bottom bar */}
      {isSelected && (
        <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-lg bg-primary" />
      )}
    </div>
  );
}

export default function FareSlider({ fares, selectedId, onSelect }: Props) {
  const swiperRef = useRef<{
    slideTo: (index: number, speed?: number) => void;
  } | null>(null);

  // Scroll to selected slide when selectedId changes
  useEffect(() => {
    const idx = fares.findIndex((f) => f.id === selectedId);
    if (idx !== -1 && swiperRef.current) {
      swiperRef.current.slideTo(idx, 300);
    }
  }, [selectedId, fares]);

  return (
    <div className="relative w-full">
      <Swiper
        slidesPerView="auto"
        spaceBetween={12}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
      >
        {fares.map((fare) => (
          <SwiperSlide key={fare.id} style={{ width: "300px", height: "auto" }}>
            <FareCard
              fare={fare}
              isSelected={selectedId === fare.id}
              onSelect={() => onSelect(fare.id)}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
