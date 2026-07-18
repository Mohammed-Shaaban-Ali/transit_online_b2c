"use client";

import { Wallet } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatePrice, formatCheckoutBalance } from "@/utils/formatePrice";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";

interface LicensePriceCardProps {
  calculatedData?: LoyaltyCalculatePriceResponse["data"];
  isCalculating?: boolean;
  fallbackTotal?: number;
  fallbackCurrency?: string;
  paymentGateways?: string[];
  selectedPaymentGateway?: string;
  onPaymentGatewayChange?: (value: string) => void;
  availableBalance?: number;
}

export default function LicensePriceCard({
  calculatedData,
  isCalculating = false,
  fallbackTotal = 0,
  fallbackCurrency = "SAR",
  paymentGateways = [],
  selectedPaymentGateway,
  onPaymentGatewayChange,
  availableBalance = 0,
}: LicensePriceCardProps) {
  const t = useTranslations("LicenseBooking");
  const locale = useLocale();

  const currency = calculatedData?.currency ?? fallbackCurrency;
  const total = calculatedData?.total?.value ?? fallbackTotal;
  const payments = calculatedData?.payments ?? [];

  const getGatewayLabel = (gateway: string) => {
    const normalizedGateway = gateway.toLowerCase();
    if (normalizedGateway === "balance") return t("payWithBalance");
    if (normalizedGateway.includes("myfatoorah")) return "MyFatoorah";
    if (normalizedGateway.includes("tamara")) return t("tamara");
    return gateway;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="p-4 sm:p-5">
        <h3 className="mb-4 text-18 font-bold text-slate-900">
          {t("priceDetails")}
        </h3>

        <p className="mb-3 text-14 text-slate-700">{t("internationalLicense")}</p>

        {isCalculating ? (
          <div className="my-3 space-y-2">
            <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-gray-200" />
          </div>
        ) : (
          payments.length > 0 && (
            <div className="my-2 space-y-2 border-s-2 border-gray-200 ps-3 text-14 text-gray-600">
              {payments.map((item, idx) => {
                const isDiscount = item.type === "COUPON";
                return (
                  <div
                    key={`${item.label}-${idx}`}
                    className="flex items-center justify-between gap-2"
                  >
                    <span>{item.label}</span>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rtl:flex-row-reverse ${
                        isDiscount ? "text-teal-600" : ""
                      }`}
                    >
                      {isDiscount ? <span>-</span> : null}
                      <span>{currency}</span>
                      <span>{formatePrice(item.value)}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}

        {!isCalculating && paymentGateways.length > 0 ? (
          <div className="mt-4 space-y-2">
            <p className="text-14 font-medium text-slate-800">
              {t("choosePaymentMethod")}
            </p>
            <div className="space-y-2">
              {paymentGateways.map((gateway) => {
                const isSelected = selectedPaymentGateway === gateway;
                const isBalance = gateway.toLowerCase() === "balance";

                return (
                  <button
                    key={gateway}
                    type="button"
                    onClick={() => onPaymentGatewayChange?.(gateway)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-start transition-colors ${
                      isSelected
                        ? "border-primary/30 bg-primary/5"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isSelected ? "border-primary" : "border-gray-300"
                      }`}
                    >
                      {isSelected ? (
                        <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      ) : null}
                    </span>
                    {isBalance ? (
                      <Wallet className="h-5 w-5 shrink-0 text-primary" />
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isSelected ? "text-primary" : "text-gray-700"
                        }`}
                      >
                        {getGatewayLabel(gateway)}
                      </p>
                      {isBalance ? (
                        <p className="text-xs text-gray-500">
                          {t("availableBalance")}: {currency}{" "}
                          {formatCheckoutBalance(availableBalance, locale)}
                        </p>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="my-3 border-t border-dashed border-gray-300" />

        <div className="flex items-center justify-between gap-3">
          <span className="text-20 font-bold text-slate-900">{t("total")}</span>
          {isCalculating ? (
            <div className="h-8 w-28 animate-pulse rounded-lg bg-gray-200" />
          ) : (
            <span className="inline-flex items-center gap-1 text-20 font-bold rtl:flex-row-reverse">
              <span className="text-14 font-semibold">{currency}</span>
              <span>{formatePrice(total)}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
