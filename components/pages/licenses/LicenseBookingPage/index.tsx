"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import {
  LICENSE_BOOKING_FORM_DATA_KEY,
  LICENSE_BOOKING_ID_KEY,
  LICENSE_BOOKING_PRICE_DATA_KEY,
} from "@/constants";
import type { LoyaltyCalculatePriceResponse } from "@/redux/features/flights/flightsApi";
import {
  useBookLicenseMutation,
  useGetLicensePriceQuery,
  useLazyCalculateLicensePriceQuery,
  useLazyGetLicenseBookingQuery,
  type LicenseBookResponse,
} from "@/redux/features/licenses/licensesApi";
import { verifyBookingWithRetries } from "@/utils/verifyBookingWithRetries";
import requirementsTitleImage from "@/public/images/requirementsTitle.jpeg";
import LicenseBookingForm from "./LicenseBookingForm";
import LicenseFaq from "./LicenseFaq";
import LicensePriceCard from "./LicensePriceCard";
import type { LicenseBookingFormValues } from "./types";
import { LICENSE_RESULT_PATH } from "./types";

type CalculatedPriceData = LoyaltyCalculatePriceResponse["data"];

const BALANCE_PAYMENT_GATEWAY = "balance";
const DEFAULT_PAYMENT_GATEWAY = "myfatoorah";
const BALANCE_RESULT_DELAY_MS = 3000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const getPaymentGatewayOptions = (
  paymentGateways: string[] = [],
  availableBalance = 0,
  totalPrice = 0,
) => {
  const gatewayOptions = paymentGateways.reduce<string[]>(
    (options, gateway) => {
      const value = String(gateway || "").trim();
      const alreadyExists = options.some(
        (option) => option.toLowerCase() === value.toLowerCase(),
      );

      if (
        value &&
        value.toLowerCase() !== BALANCE_PAYMENT_GATEWAY &&
        !alreadyExists
      ) {
        options.push(value);
      }

      return options;
    },
    [],
  );

  if (totalPrice > 0 && availableBalance >= totalPrice) {
    gatewayOptions.push(BALANCE_PAYMENT_GATEWAY);
  }

  return gatewayOptions;
};

const resolvePaymentGateway = (
  priceData: CalculatedPriceData,
  selectedGateway: string,
) => {
  const total = Number(priceData.total?.value || 0);
  const balance = Number(priceData.available_balance || 0);
  const gatewayOptions = getPaymentGatewayOptions(
    priceData.payment_gateways?.length
      ? priceData.payment_gateways
      : [DEFAULT_PAYMENT_GATEWAY],
    balance,
    total,
  );

  return selectedGateway && gatewayOptions.includes(selectedGateway)
    ? selectedGateway
    : gatewayOptions[0];
};

const isBalancePaymentSelected = (gateway: string) =>
  gateway.toLowerCase() === BALANCE_PAYMENT_GATEWAY;

const isBalanceInsufficientForTotal = (
  total: number,
  balance: number,
  selectedGateway: string,
) => isBalancePaymentSelected(selectedGateway) && total > 0 && balance < total;

export default function LicenseBookingPage() {
  const t = useTranslations("LicenseBooking");
  const locale = useLocale();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBalanceResultPending, setIsBalanceResultPending] = useState(false);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState("");

  const priceQuery = useGetLicensePriceQuery();
  const [calculatePrice, calculatePriceState] =
    useLazyCalculateLicensePriceQuery();
  const [bookLicense] = useBookLicenseMutation();
  const [fetchLicenseBooking] = useLazyGetLicenseBookingQuery();

  const originalPrice = Number(priceQuery.data?.data || 0);
  const baseCurrency = priceQuery.data?.currency || "SAR";

  useEffect(() => {
    if (!originalPrice) return;

    calculatePrice({
      originalPrice,
      module: "licenses",
      points: false,
      ...(selectedPaymentGateway
        ? { paymentMethod: selectedPaymentGateway }
        : {}),
    })
      .unwrap()
      .catch((error) => {
        console.error("License price calculation error:", error);
      });
  }, [originalPrice, calculatePrice, selectedPaymentGateway]);

  const calculatedData = calculatePriceState.data?.data;
  const latestTotalPrice = Number(
    calculatedData?.total?.value || originalPrice || 0,
  );
  const availableBalance = Number(calculatedData?.available_balance || 0);
  const paymentGatewayOptions = useMemo(
    () =>
      getPaymentGatewayOptions(
        calculatedData
          ? calculatedData.payment_gateways?.length
            ? calculatedData.payment_gateways
            : [DEFAULT_PAYMENT_GATEWAY]
          : undefined,
        availableBalance,
        latestTotalPrice,
      ),
    [calculatedData, availableBalance, latestTotalPrice],
  );

  useEffect(() => {
    if (paymentGatewayOptions.length === 0) {
      setSelectedPaymentGateway("");
      return;
    }

    setSelectedPaymentGateway((currentGateway) =>
      currentGateway && paymentGatewayOptions.includes(currentGateway)
        ? currentGateway
        : paymentGatewayOptions[0],
    );
  }, [paymentGatewayOptions]);

  const completeBookingFlow = async (
    data: LicenseBookingFormValues,
    response: LicenseBookResponse,
    priceData: CalculatedPriceData,
    paymentGateway: string,
  ) => {
    const storableForm = {
      name: data.name,
      email: data.email,
      address: data.address,
      phone: data.phone,
      phoneCountryCode: data.phoneCountryCode,
    };

    sessionStorage.setItem(
      LICENSE_BOOKING_ID_KEY,
      String(response.bookingReference || ""),
    );
    sessionStorage.setItem(
      LICENSE_BOOKING_FORM_DATA_KEY,
      JSON.stringify(storableForm),
    );
    sessionStorage.setItem(
      LICENSE_BOOKING_PRICE_DATA_KEY,
      JSON.stringify(priceData),
    );

    const resolveBookingSuccess = async () => {
      if (!response.bookingReference) return false;

      return verifyBookingWithRetries(String(response.bookingReference), (id) =>
        fetchLicenseBooking(id).unwrap(),
      );
    };

    if (isBalancePaymentSelected(paymentGateway)) {
      setIsBalanceResultPending(true);
      await wait(BALANCE_RESULT_DELAY_MS);
      const isSuccess = await resolveBookingSuccess();
      router.replace(
        `${LICENSE_RESULT_PATH}?success=${isSuccess ? "true" : "false"}`,
      );
      return;
    }

    if (response.redirectUrl) {
      window.location.assign(response.redirectUrl);
      return;
    }

    setIsBalanceResultPending(true);
    const isSuccess = await resolveBookingSuccess();
    router.replace(
      `${LICENSE_RESULT_PATH}?success=${isSuccess ? "true" : "false"}`,
    );
  };

  const handleSubmit = async (data: LicenseBookingFormValues) => {
    if (!calculatedData) {
      toast.error(t("priceValidationError"));
      return;
    }

    if (
      isBalanceInsufficientForTotal(
        latestTotalPrice,
        availableBalance,
        selectedPaymentGateway,
      )
    ) {
      toast.error(t("insufficientBalanceDescription"));
      return;
    }

    const paymentGateway = resolvePaymentGateway(
      calculatedData,
      selectedPaymentGateway,
    );

    if (!paymentGateway) {
      toast.error(t("priceValidationError"));
      return;
    }

    if (!data.passportPhoto || !data.localLicensePhoto || !data.personalPhoto) {
      toast.error(t("validation.filesRequired"));
      return;
    }

    const phoneDigits = data.phone.trim().replace(/\D/g, "");
    const countryCodeDigits = data.phoneCountryCode.replace(/\D/g, "");
    const localPhone = countryCodeDigits
      ? phoneDigits.startsWith(countryCodeDigits)
        ? phoneDigits.slice(countryCodeDigits.length)
        : phoneDigits
      : phoneDigits;
    const redirectUrl = new URL(
      `/${locale}${LICENSE_RESULT_PATH}`,
      window.location.origin,
    ).toString();

    setIsSubmitting(true);
    try {
      const response = await bookLicense({
        paymentGateway,
        redirectUrl,
        contact_info: {
          name: data.name.trim(),
          email: data.email.trim(),
          phone: localPhone,
          country_calling_code: countryCodeDigits,
          address: data.address.trim(),
        },
        passportPhoto: data.passportPhoto,
        localLicensePhoto: data.localLicensePhoto,
        personalPhoto: data.personalPhoto,
      }).unwrap();

      await completeBookingFlow(data, response, calculatedData, paymentGateway);
    } catch (error) {
      console.error("License booking error:", error);
    } finally {
      setIsBalanceResultPending(false);
      setIsSubmitting(false);
    }
  };

  const isLoadingPrice = priceQuery.isLoading || priceQuery.isFetching;

  return (
    <div className="container mx-auto max-w-[1200px]! px-4">
      {isBalanceResultPending ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white px-8 py-6 shadow-lg">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-sm font-medium text-gray-700">
              {t("submitting")}
            </p>
          </div>
        </div>
      ) : null}

      <div
        className="mb-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6 flex items-center gap-4 
      flex-wrap justify-between"
      >
        <div className="flex-1">
          <h2 className="mb-3 text-2xl font-bold text-slate-900">
            {t("requirementsTitle")}
          </h2>
          <ol className="list-decimal space-y-1.5 ps-5 text-lg text-slate-700">
            <li>{t("passportPhoto")}</li>
            <li>{t("localLicensePhoto")}</li>
            <li>{t("personalPhotoRequirement")}</li>
          </ol>
        </div>
        <div className="w-fit ms-auto">
          <Image
            src={requirementsTitleImage}
            alt={t("requirementsTitle")}
            // width={500}
            // height={500}
            className="max-h-52 w-full object-contain"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <LicenseBookingForm
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
          <LicenseFaq />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-12">
            <LicensePriceCard
              calculatedData={calculatedData}
              isCalculating={
                isLoadingPrice ||
                (!!originalPrice && calculatePriceState.isFetching)
              }
              fallbackTotal={originalPrice}
              fallbackCurrency={baseCurrency}
              paymentGateways={paymentGatewayOptions}
              selectedPaymentGateway={selectedPaymentGateway}
              onPaymentGatewayChange={setSelectedPaymentGateway}
              availableBalance={availableBalance}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
