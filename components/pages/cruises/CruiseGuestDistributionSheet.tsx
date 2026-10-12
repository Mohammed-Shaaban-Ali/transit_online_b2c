"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { CruiseCabinGuestSlot } from "@/types/cruiseTypes";
import { assignGuestToCabin } from "@/utils/cruiseCabinHelpers";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slots: CruiseCabinGuestSlot[];
  cabinCount: number;
  onApply: (slots: CruiseCabinGuestSlot[]) => void;
};

function guestLabel(
  slot: CruiseCabinGuestSlot,
  t: ReturnType<typeof useTranslations>,
) {
  if (slot.type === "ADT") return t("adultN", { n: slot.index });
  if (slot.type === "CHD") return t("childN", { n: slot.index });
  return t("infantN", { n: slot.index });
}

function CruiseGuestDistributionSheet({
  open,
  onOpenChange,
  slots,
  cabinCount,
  onApply,
}: Props) {
  const t = useTranslations("CruisePage.Cabins");
  const [draft, setDraft] = useState(slots);

  useEffect(() => {
    if (open) setDraft(slots);
  }, [open, slots]);

  const handleChange = (guestId: string, cabinIndex: number) => {
    const next = assignGuestToCabin(draft, guestId, cabinIndex);
    if (!next) {
      toast.error(t("adultRequiredError"));
      return;
    }
    setDraft(next);
  };

  const handleApply = () => {
    for (let i = 0; i < cabinCount; i += 1) {
      const adults = draft.filter(
        (slot) => slot.type === "ADT" && slot.cabinIndex === i,
      ).length;
      if (adults < 1) {
        toast.error(t("adultRequiredError"));
        return;
      }
    }
    onApply(draft);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="left-1/2 right-auto max-h-[85vh] w-full max-w-[720px] -translate-x-1/2 overflow-y-auto rounded-t-2xl px-4 pb-6 pt-4 sm:px-5"
      >
        <SheetHeader className="mb-4 items-start space-y-0 text-start sm:text-start">
          <SheetTitle className="w-full text-start text-base font-bold text-gray-900">
            {t("distributeGuests")}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3">
          {draft.map((slot) => (
            <div
              key={slot.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-3 py-3"
            >
              <p className="text-sm font-bold text-gray-900">
                {guestLabel(slot, t)}
              </p>
              <div
                className="flex flex-wrap gap-2"
                role="tablist"
                aria-label={guestLabel(slot, t)}
              >
                {Array.from({ length: cabinCount }, (_, index) => {
                  const selected = slot.cabinIndex === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => handleChange(slot.id, index)}
                      className={cn(
                        "inline-flex min-w-10 items-center justify-center rounded-xl px-3.5 py-2 text-sm font-bold transition-colors",
                        selected
                          ? "bg-primary text-white"
                          : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-50",
                      )}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleApply}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white hover:bg-primary/90"
        >
          {t("apply")}
        </button>
      </SheetContent>
    </Sheet>
  );
}

export default CruiseGuestDistributionSheet;
