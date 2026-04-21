"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import PassengerInformationSection from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm/PassengerInformationSection";
import ContactInformationSection from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm/ContactInformationSection";
import BaggageAllowance from "./BaggageAllowance";
import CheckedBaggageProtection from "./CheckedBaggageProtection";
import CancellationsChangesSection from "./CancellationsChangesSection";
import StayDiscountsSection from "./StayDiscountsSection";
import FreePromoCodesSection from "./FreePromoCodesSection";
import PromoCodesSection from "./PromoCodesSection";
import { FlightDirection } from "@/types/flightTypes";

// Types
export interface FlightPassengerData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  passportNumber: string;
  nationality: string;
  passportExpiry: string;
  type: "adult" | "child" | "infant";
}

export interface FlightBookingFormValues {
  fullName: string;
  email: string;
  phone: string;
  passengers: FlightPassengerData[];
}

interface FlightBookingFormProps {
  adults: number;
  children: number;
  infants: number;
  isSubmitting?: boolean;
  onSubmit: (data: FlightBookingFormValues) => void;
  flights: FlightDirection[];
}

export default function FlightBookingForm({
  adults,
  children: childrenCount,
  infants,
  isSubmitting = false,
  flights,
  onSubmit,
}: FlightBookingFormProps) {
  const t = useTranslations("FlightBookingForm");
  const tNested = useTranslations("FlightBookingPageNested.flightBookingForm");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const defaultPassengers = useMemo(() => {
    const passengers: FlightPassengerData[] = [];

    for (let i = 0; i < adults; i++) {
      passengers.push({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male",
        passportNumber: "",
        nationality: "",
        passportExpiry: "",
        type: "adult",
      });
    }

    for (let i = 0; i < childrenCount; i++) {
      passengers.push({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male",
        passportNumber: "",
        nationality: "",
        passportExpiry: "",
        type: "child",
      });
    }

    for (let i = 0; i < infants; i++) {
      passengers.push({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "male",
        passportNumber: "",
        nationality: "",
        passportExpiry: "",
        type: "infant",
      });
    }

    return passengers;
  }, [adults, childrenCount, infants]);

  const [idTypeByPassenger, setIdTypeByPassenger] = useState<string[]>([]);

  useEffect(() => {
    setIdTypeByPassenger(defaultPassengers.map(() => ""));
  }, [defaultPassengers.length]);

  // Zod schema
  const bookingSchema = z.object({
    fullName: z.string().min(1, t("validation.fullNameRequired")),
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    phone: z.string().min(5, t("validation.phoneRequired")),
    passengers: z.array(
      z.object({
        firstName: z.string().min(1, t("validation.firstNameRequired")),
        lastName: z.string().min(1, t("validation.lastNameRequired")),
        dateOfBirth: z.string().min(1, t("validation.dateOfBirthRequired")),
        gender: z.enum(["male", "female"]),
        passportNumber: z
          .string()
          .min(1, t("validation.passportNumberRequired")),
        nationality: z.string().min(1, t("validation.nationalityRequired")),
        passportExpiry: z
          .string()
          .min(1, t("validation.passportExpiryRequired")),
        type: z.enum(["adult", "child", "infant"]),
      }),
    ),
  });

  const form = useForm<FlightBookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      passengers: defaultPassengers,
    },
  });

  const { handleSubmit } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-7 md:gap-11 pt-6 md:pt-10"
    >
      <PassengerInformationSection
        defaultPassengers={defaultPassengers}
        form={form}
        isRTL={isRTL}
        idTypeByPassenger={idTypeByPassenger}
        setIdTypeByPassenger={setIdTypeByPassenger}
      />

      <ContactInformationSection form={form} />
      <BaggageAllowance flights={flights} />
      <CheckedBaggageProtection />
      <CancellationsChangesSection />
      <StayDiscountsSection />
      <FreePromoCodesSection />
      <PromoCodesSection />

      <section className="space-y-4">
        <p className="text-[14px] md:text-[16px]">
          {tNested("termsPrefix")}{" "}
          <button type="button" className="text-primary">
            {tNested("flightBookingPolicies")}
          </button>
          ,{" "}
          <button type="button" className="text-primary">
            {tNested("privacyStatement")}
          </button>
          .
        </p>

        <div className="rounded-xl bg-white p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[20px] md:text-[24px] font-semibold leading-none">
              {tNested("total")}
            </span>
            <span className="text-[20px] md:text-[24px] font-bold leading-none text-primary">
              US$258.00
            </span>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 md:h-14 w-full rounded-lg text-[14px] md:text-[16px] font-bold text-white"
          >
            {isSubmitting ? t("submitting") : tNested("next")}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-5 md:gap-x-8 gap-y-2.5 md:gap-y-3 text-[12px] md:text-[14px] text-slate-600">
          <div className="flex items-center gap-2">
            <img
              src="https://ak-d.tripcdn.com/images/05S4r12000ceoxeo136F7.png"
              alt={tNested("awardWinning")}
              className="h-5 w-5 object-contain"
            />
            <span>{tNested("awardWinning")}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://ak-d.tripcdn.com/images/0AS5f120008whj34f2145.png"
              alt={tNested("supportIn30s")}
              className="h-5 w-5 object-contain"
            />
            <span>{tNested("supportIn30s")}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src="https://ak-d.tripcdn.com/images/0AS5x120008whk01q784B.png"
              alt={tNested("rewardsForBooking")}
              className="h-5 w-5 object-contain"
            />
            <span>{tNested("rewardsForBooking")}</span>
          </div>
        </div>
      </section>
    </form>
  );
}
