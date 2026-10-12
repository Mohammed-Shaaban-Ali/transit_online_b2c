"use client";

import Image from "next/image";
import { Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatePrice, formatCheckoutBalance } from "@/utils/formatePrice";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import BookingProfitTotalSection from "@/components/shared/booking/BookingProfitTotalSection";

type Props = {
  calculatedData?: LoyaltyCalculatePriceResponse["data"];
  isCalculating?: boolean;
  fallbackTotal?: number;
  paymentGateways?: string[];
  selectedPaymentGateway?: string;
  onPaymentGatewayChange?: (value: string) => void;
  availableBalance?: number;
  formId: string;
  submitLabel: string;
  isSubmitting?: boolean;
  cabinsCount: number;
  guestsCount: number;
  profit?: number;
  onProfitChange?: (value: number) => void;
  showProfitInput?: boolean;
};

function CruisePriceSidebar({
  calculatedData,
  isCalculating = false,
  fallbackTotal = 0,
  paymentGateways = [],
  selectedPaymentGateway,
  onPaymentGatewayChange,
  availableBalance = 0,
  formId,
  submitLabel,
  isSubmitting = false,
  cabinsCount,
  guestsCount,
  profit = 0,
  onProfitChange,
  showProfitInput = false,
}: Props) {
  const t = useTranslations("CruiseBooking");
  const locale = useLocale();
  const baseTotal = calculatedData?.total?.value ?? fallbackTotal;
  const total = baseTotal + profit;
  const payments = calculatedData?.payments ?? [];

  const getGatewayLabel = (gateway: string) => {
    const normalized = gateway.toLowerCase();
    if (normalized === "balance") return t("payWithBalance");
    if (normalized === "tamara") return t("tamara");
    if (normalized.includes("myfatoorah")) return "MyFatoorah";
    return gateway;
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="p-4 md:p-5">
        <h3 className="mb-4 text-lg font-bold text-gray-900">
          {t("paymentSummary")}
        </h3>

        <div className="mb-3 space-y-1 text-sm font-bold text-gray-700">
          <p>
            {cabinsCount} {t("cabins")} • {guestsCount} {t("guests")}
          </p>
        </div>

        {isCalculating ? (
          <div className="my-3 space-y-2">
            <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
          </div>
        ) : (
          payments.length > 0 && (
            <div className="my-2 space-y-2 border-s-2 border-gray-200 ps-3 text-sm font-bold text-gray-600">
              {payments.map((item, idx) => (
                <div
                  key={`${item.label}-${idx}`}
                  className="flex items-center justify-between gap-2"
                >
                  <span>{item.label}</span>
                  <span className="inline-flex items-center gap-1" dir="ltr">
                    <CurrencySymbol size="sm" />
                    <span>{formatePrice(item.value)}</span>
                  </span>
                </div>
              ))}
            </div>
          )
        )}

        {!isCalculating && paymentGateways.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-bold text-gray-800">
              {t("paymentMethod")}
            </p>
            <div className="space-y-2">
              {paymentGateways.map((gateway) => {
                const isSelected = selectedPaymentGateway === gateway;
                const isBalance = gateway.toLowerCase() === "balance";
                const isTamara = gateway.toLowerCase() === "tamara";
                const isBalanceDisabled =
                  isBalance && total > 0 && availableBalance < total;

                return (
                  <button
                    key={gateway}
                    type="button"
                    aria-disabled={isBalanceDisabled}
                    onClick={() => {
                      if (isBalanceDisabled) return;
                      onPaymentGatewayChange?.(gateway);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start transition-colors ${
                      isBalanceDisabled
                        ? "!cursor-not-allowed  bg-red-50"
                        : isSelected
                          ? "border-primary/30 bg-primary/5"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    {!isBalanceDisabled && (
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? "border-primary" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <span className="size-2.5 rounded-full bg-primary" />
                        )}
                      </span>
                    )}
                    {isBalance && (
                      <Wallet
                        className={`size-5 shrink-0 ${
                          isBalanceDisabled ? "text-red-600" : "text-primary"
                        }`}
                      />
                    )}
                    {isTamara && (
                      <Image
                        src="/images/gita/heroimage.png"
                        alt="Tamara"
                        width={28}
                        height={28}
                        className="size-7 rounded object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-bold ${
                          isBalanceDisabled
                            ? "text-red-600"
                            : isSelected
                              ? "text-primary"
                              : "text-gray-700"
                        }`}
                      >
                        {getGatewayLabel(gateway)}
                      </p>
                      {isBalance && (
                        <p
                          className={`text-xs font-bold ${
                            isBalanceDisabled ? "text-red-500" : "text-gray-500"
                          }`}
                        >
                          {t("availableBalance")}:{" "}
                          <span className="inline-flex items-center gap-1" dir="ltr">
                            <CurrencySymbol size="sm" />
                            {formatCheckoutBalance(availableBalance, locale)}
                          </span>
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="my-4 border-t border-dashed border-gray-300" />

        <BookingProfitTotalSection
          inputId="cruise-booking-profit"
          profitLabel={t("profit")}
          totalLabel={t("finalPrice")}
          baseTotal={baseTotal}
          profit={profit}
          onProfitChange={onProfitChange ?? (() => {})}
          isCalculating={isCalculating}
          showProfitInput={showProfitInput}
          totalSize="md"
          totalValueClassName="text-primary"
        />

        <button
          type="button"
          disabled={isSubmitting || isCalculating}
          onClick={() => {
            const form = document.getElementById(
              formId,
            ) as HTMLFormElement | null;
            form?.requestSubmit();
          }}
          className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

export default CruisePriceSidebar;
