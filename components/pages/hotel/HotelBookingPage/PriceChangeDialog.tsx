"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatePrice } from "@/utils/formatePrice";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";

interface PriceChangeDialogProps {
  open: boolean;
  priceChanged: boolean;
  insufficientBalance: boolean;
  oldPrice: number;
  newPrice: number;
  availableBalance: number;
  /** @deprecated Display uses Riyal icon; kept for caller compatibility */
  currency?: string;
  isSubmitting?: boolean;
  translationNamespace?: "HotelBooking" | "FlightBooking" | "CruiseBooking";
  onContinue: () => void;
  onChoosePaymentMethod: () => void;
  onBackToSearch: () => void;
}

const PriceChangeDialog = ({
  open,
  priceChanged,
  insufficientBalance,
  oldPrice,
  newPrice,
  availableBalance,
  isSubmitting = false,
  translationNamespace = "HotelBooking",
  onContinue,
  onChoosePaymentMethod,
  onBackToSearch,
}: PriceChangeDialogProps) => {
  const t = useTranslations(translationNamespace);

  const title = insufficientBalance
    ? priceChanged
      ? t("priceAndBalanceChanged")
      : t("insufficientBalanceTitle")
    : t("priceChanged");

  const description = insufficientBalance
    ? priceChanged
      ? t("priceAndBalanceChangedDescription")
      : t("insufficientBalanceDescription")
    : t("priceChangedDescription");

  const canContinueWithNewPrice = priceChanged && !insufficientBalance;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-xl" showCloseButton={false}>
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        {priceChanged && (
          <div className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-600">{t("oldPrice")}</span>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 line-through" dir="ltr">
                <CurrencySymbol size="sm" />
                <span>{formatePrice(oldPrice)}</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-gray-800">
                {t("newPrice")}
              </span>
              <span className="inline-flex items-center gap-1 text-lg font-bold text-primary" dir="ltr">
                <CurrencySymbol size="sm" />
                <span>{formatePrice(newPrice)}</span>
              </span>
            </div>
          </div>
        )}

        {insufficientBalance && (
          <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <Wallet className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-red-800">
                  {t("insufficientBalanceNote")}
                </p>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-red-700">{t("total")}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-800" dir="ltr">
                    <CurrencySymbol size="sm" />
                    <span>{formatePrice(newPrice)}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-red-700">
                    {t("availableBalance")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-800" dir="ltr">
                    <CurrencySymbol size="sm" />
                    <span>{formatePrice(availableBalance)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onBackToSearch}
            className="w-full sm:w-auto font-normal"
          >
            {t("backToSearch")}
          </Button>
          {insufficientBalance ? (
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={onChoosePaymentMethod}
              className="w-full sm:w-auto font-normal"
            >
              {t("chooseAnotherPaymentMethod")}
            </Button>
          ) : (
            canContinueWithNewPrice && (
              <Button
                type="button"
                disabled={isSubmitting}
                onClick={onContinue}
                className="w-full sm:w-auto font-normal"
              >
                {isSubmitting ? t("submitting") : t("continueWithNewPrice")}
              </Button>
            )
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriceChangeDialog;
