"use client";

import { useState } from "react";
import { X, ArrowLeftRight, Users, ChevronLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { FlightData, FareOption } from "../data/flights";
import FlightLeg from "./FlightLeg";
import FareSlider from "./FareSlider";

type Props = {
  open: boolean;
  onClose: () => void;
  departureFlightData: FlightData;
  returnFlightData: FlightData;
  onConfirm: (departureFare: FareOption, returnFare: FareOption) => void;
};

export default function FareSelectionDialog({
  open,
  onClose,
  departureFlightData,
  returnFlightData,
  onConfirm,
}: Props) {
  const [step, setStep] = useState<"departure" | "return">("departure");

  const [selectedDepartureFareId, setSelectedDepartureFareId] =
    useState<string>(departureFlightData.fareOptions[0]?.id ?? "");
  const [selectedReturnFareId, setSelectedReturnFareId] = useState<string>(
    returnFlightData.fareOptions[0]?.id ?? "",
  );

  const selectedDepartureFare =
    departureFlightData.fareOptions.find(
      (f) => f.id === selectedDepartureFareId,
    ) ?? departureFlightData.fareOptions[0];

  const selectedReturnFare =
    returnFlightData.fareOptions.find((f) => f.id === selectedReturnFareId) ??
    returnFlightData.fareOptions[0];

  const isReturnStep = step === "return";
  const currentFlight = isReturnStep ? returnFlightData : departureFlightData;
  const currentSelectedId = isReturnStep
    ? selectedReturnFareId
    : selectedDepartureFareId;
  const currentSelectedFare = isReturnStep
    ? selectedReturnFare
    : selectedDepartureFare;
  const currentOnSelect = isReturnStep
    ? setSelectedReturnFareId
    : setSelectedDepartureFareId;

  const handleNext = () => {
    if (!isReturnStep) {
      setStep("return");
    } else {
      if (selectedDepartureFare && selectedReturnFare) {
        onConfirm(selectedDepartureFare, selectedReturnFare);
      }
    }
  };

  const handleBack = () => {
    setStep("departure");
  };

  const handleClose = () => {
    setStep("departure");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-none w-[95vw] lg:w-[1024px] p-0 gap-0 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            {isReturnStep && (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
            )}
            <h2 className="text-[20px] font-bold text-gray-900">
              New York{" "}
              <ArrowLeftRight size={18} className="inline text-gray-600 mx-1" />{" "}
              Miami
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Flight legs summary */}
        <div className="grid grid-cols-2 divide-x divide-gray-200 px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="pr-6">
            <FlightLeg
              flight={departureFlightData}
              label="Depart"
              date="Fri, Apr 10"
            />
          </div>
          <div className="pl-6">
            <FlightLeg
              flight={returnFlightData}
              label="Return"
              date="Mon, Apr 13"
            />
          </div>
        </div>

        {/* Current step label */}
        <div className="px-6 pt-5 pb-1">
          <p className="text-[14px] font-semibold text-gray-700">
            {isReturnStep
              ? "Choose your return fare"
              : "Choose your departure fare"}
          </p>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {currentFlight.airline} · {currentFlight.flightNumber} ·{" "}
            {currentFlight.departureTime} → {currentFlight.arrivalTime}
          </p>
        </div>

        {/* Fare slider */}
        <div className="px-6 pt-3 pb-6">
          <FareSlider
            fares={currentFlight.fareOptions}
            selectedId={currentSelectedId}
            onSelect={currentOnSelect}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-6 py-4 border-t border-gray-100 bg-white sticky bottom-0 z-10">
          <div className="flex items-end gap-1.5">
            <p className="text-[14px] text-gray-500 mb-1">
              {isReturnStep ? "Round-trip" : "Departure"}
            </p>
            <p className="text-[24px] font-bold text-primary">
              {currentSelectedFare?.currency}
              {currentSelectedFare?.price}
            </p>
          </div>
          <button
            type="button"
            onClick={handleNext}
            className="h-14 rounded bg-primary px-8 text-[18px] font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer"
          >
            {isReturnStep ? "Continue" : "Next"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
