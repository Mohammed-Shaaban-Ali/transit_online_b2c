"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
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
  onSubmit: (data: FlightBookingFormValues) => void;
  flights: FlightDirection[];
}

export default function FlightBookingForm({
  adults,
  children: childrenCount,
  infants,
  flights,
  onSubmit,
}: FlightBookingFormProps) {
  const t = useTranslations("FlightBookingForm");
  const tNested = useTranslations("FlightBookingPageNested.flightBookingForm");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

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

  // Zod schema
  const bookingSchema = z.object({
    fullName: z
      .string()
      .min(1, t("validation.fullNameRequired"))
      .refine(
        (value) => value.trim().split(/\s+/).filter(Boolean).length >= 2,
        t("validation.fullNameRequired"),
      ),
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    phone: z
      .string()
      .min(5, t("validation.phoneRequired"))
      .regex(/^\d+$/, "contact info phone must contain digits only")
      .refine(
        (value) => value.length <= 10,
        "contact info phone Must be less than or equal 10 digits",
      ),
    passengers: z.array(
      z.object({
        firstName: z
          .string()
          .min(1, t("validation.firstNameRequired"))
          .regex(
            /^[A-Za-z\s]+$/,
            "name must only contain a-z, A-Z or space",
          ),
        lastName: z
          .string()
          .min(1, t("validation.lastNameRequired"))
          .regex(
            /^[A-Za-z\s]+$/,
            "lastName must only contain a-z, A-Z or space",
          ),
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
  }).superRefine((values, ctx) => {
    const passportByValue: Record<string, number[]> = {};

    values.passengers.forEach((passenger, index) => {
      const trimmedPassport = passenger.passportNumber.trim();
      if (trimmedPassport) {
        passportByValue[trimmedPassport] = passportByValue[trimmedPassport]
          ? [...passportByValue[trimmedPassport], index]
          : [index];
      }

      if (!passenger.dateOfBirth) return;
      const age = calculateAge(passenger.dateOfBirth);

      if (passenger.type === "adult" && age < 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["passengers", index, "dateOfBirth"],
          message: "Adult must be 12+ years old",
        });
      }

      if (passenger.type === "child" && (age < 2 || age > 11)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["passengers", index, "dateOfBirth"],
          message: "Child must be 2-11 years old",
        });
      }

      if (passenger.type === "infant" && age >= 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["passengers", index, "dateOfBirth"],
          message: "Infant must be under 2 years old",
        });
      }
    });

    Object.values(passportByValue).forEach((indices) => {
      if (indices.length <= 1) return;
      indices.forEach((index) => {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["passengers", index, "passportNumber"],
          message: "passport.no Must be unique for each passenger",
        });
      });
    });
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
      id="flight-booking-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-7 md:gap-11 pt-6 md:pt-10"
    >
      <PassengerInformationSection
        defaultPassengers={defaultPassengers}
        form={form}
        isRTL={isRTL}
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
