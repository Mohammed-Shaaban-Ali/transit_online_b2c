"use client";

import { X, ChevronDown } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import CounterRow from "./CounterRow";
import { FlightSearchFormValues } from "../types";
import { MdChildCare, MdOutlineChildFriendly, MdPerson } from "react-icons/md";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const MAX_ADULTS = 9;
const MAX_CHILDREN = 9;
const MAX_INFANTS = 9;

type SheetType = "passengers" | "cabin" | null;

type Props = {
  form: UseFormReturn<FlightSearchFormValues>;
  openSheet: SheetType;
  onOpenSheet: (sheet: SheetType) => void;
};

function MobilePassengersSheet({ form, openSheet, onOpenSheet }: Props) {
  const t = useTranslations("FlightsTestForm.Passengers");
  const { watch, setValue } = form;
  const adults = watch("adults") || 1;
  const children = watch("children") || 0;
  const infants = watch("infants") || 0;
  const cabinClass = watch("cabinClass") || "ECONOMY";

  const CABIN_OPTIONS = [
    { value: "ECONOMY" as const, label: t("economy") },
    { value: "BUSINESS" as const, label: t("business") },
  ];

  const cabinDisplayText =
    CABIN_OPTIONS.find((o) => o.value === cabinClass)?.label ?? t("economy");

  const handleAdultsChange = (value: number) => {
    const newAdults = Math.max(1, Math.min(MAX_ADULTS, value));
    setValue("adults", newAdults);
    if (newAdults < infants) setValue("infants", newAdults);
  };
  const handleChildrenChange = (value: number) =>
    setValue("children", Math.max(0, Math.min(MAX_CHILDREN, value)));
  const handleInfantsChange = (value: number) =>
    setValue("infants", Math.max(0, Math.min(MAX_INFANTS, adults, value)));

  return (
    <>
      {/* Combined passengers + cabin row */}
      <div className="flex h-[54px] items-center gap-1.5 border-b border-gray-200">
        {/* Passengers part */}
        <button
          type="button"
          onClick={() => onOpenSheet("passengers")}
          className="flex shrink-0 items-center gap-1.5"
        >
          <MdPerson size={17} className="text-gray-600" />
          <span className="text-[14px] font-medium text-black">{adults}</span>

          <MdChildCare size={17} className="text-gray-600" />
          <span className="text-[14px] font-medium text-black">{children}</span>

          <MdOutlineChildFriendly size={17} className="text-gray-600" />
          <span className="text-[14px] font-medium text-black">{infants}</span>
        </button>

        {/* Separator */}
        <span className="mx-0.5 select-none text-[16px] font-light text-gray-300">
          |
        </span>

        {/* Cabin class part */}
        <button
          type="button"
          onClick={() => onOpenSheet("cabin")}
          className="flex min-w-0 flex-1 items-center gap-1"
        >
          <span className="flex-1 truncate text-start text-[14px] font-medium text-black">
            {cabinDisplayText}
          </span>
          <ChevronDown size={17} className="shrink-0 text-gray-500" />
        </button>
      </div>

      <Sheet
        open={openSheet !== null}
        onOpenChange={(open) => {
          if (!open) onOpenSheet(null);
        }}
      >
        <SheetContent
          side="bottom"
          className={cn(
            "flex max-h-[min(90vh,calc(100%-1.5rem))] flex-col overflow-hidden rounded-t-2xl border-0 p-0",
            "inset-x-4 bottom-4 w-auto",
            "bg-linear-to-b from-white via-[#fafbfc] to-[#ebedf1]",
            "shadow-[0_-10px_40px_rgba(17,24,39,0.14)]",
            "[&>button.absolute]:hidden",
          )}
        >
          <SheetTitle className="sr-only">
            {openSheet === "passengers"
              ? t("passengersTitle")
              : openSheet === "cabin"
                ? t("cabinClassTitle")
                : t("flightSearchOptions")}
          </SheetTitle>

          <div className="flex justify-center pt-3 pb-1">
            <div className="h-1 w-10 rounded-full bg-gray-300" />
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-gray-100/80 px-4 py-3.5">
            <button
              type="button"
              onClick={() => onOpenSheet(null)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <h2 className="text-[16px] font-semibold text-black">
              {openSheet === "passengers" ? t("passengersTitle") : t("cabinClassTitle")}
            </h2>
            <div className="w-8" />
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {openSheet === "passengers" && (
              <>
                <CounterRow
                  compact
                  title={t("adults")}
                  subtitle={t("adultsAgeMobile")}
                  value={adults}
                  onMinus={() => handleAdultsChange(adults - 1)}
                  onPlus={() => handleAdultsChange(adults + 1)}
                />
                <CounterRow
                  compact
                  title={t("children")}
                  subtitle={t("childrenAgeMobile")}
                  value={children}
                  onMinus={() => handleChildrenChange(children - 1)}
                  onPlus={() => handleChildrenChange(children + 1)}
                />
                <CounterRow
                  compact
                  title={t("infantsLap")}
                  subtitle={t("infantsAgeMobile")}
                  value={infants}
                  onMinus={() => handleInfantsChange(infants - 1)}
                  onPlus={() =>
                    handleInfantsChange(Math.min(adults, infants + 1))
                  }
                />
                <button
                  type="button"
                  onClick={() => onOpenSheet(null)}
                  className="mt-3 h-[48px] w-full rounded-lg bg-primary text-[15px] font-semibold text-white hover:bg-primary/80"
                >
                  {t("done")}
                </button>
              </>
            )}

            {openSheet === "cabin" && (
              <div className="space-y-2">
                {CABIN_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setValue("cabinClass", option.value);
                      onOpenSheet(null);
                    }}
                    className={`flex h-[48px] w-full items-center justify-between rounded-lg border px-3 text-[15px] font-medium transition-colors ${
                      cabinClass === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-200 text-black hover:border-gray-300"
                    }`}
                  >
                    {option.label}
                    {cabinClass === option.value && (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-safe-area-inset-bottom shrink-0 pb-5" />
        </SheetContent>
      </Sheet>
    </>
  );
}

export default MobilePassengersSheet;
