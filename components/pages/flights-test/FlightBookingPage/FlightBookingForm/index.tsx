"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FaUser, FaChild, FaPassport } from "react-icons/fa";
import { MdEmail, MdPhone, MdPerson } from "react-icons/md";
import { MdChildFriendly } from "react-icons/md";
import { useLocale } from "next-intl";
import NationalitySelect from "@/components/shared/NationalitySelect";

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
}

export default function FlightBookingForm({
  adults,
  children: childrenCount,
  infants,
  isSubmitting = false,
  onSubmit,
}: FlightBookingFormProps) {
  const t = useTranslations("FlightBookingForm");
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const watchFullName = watch("fullName");
  const watchEmail = watch("email");
  const watchPhone = watch("phone");

  // Helper to get passenger type label & icon
  const getPassengerTypeInfo = (type: string) => {
    switch (type) {
      case "adult":
        return {
          label: t("adult"),
          icon: <FaUser size={12} className="text-primary" />,
          bgColor: "bg-primary/10",
        };
      case "child":
        return {
          label: t("child"),
          icon: <FaChild size={12} className="text-orange-500" />,
          bgColor: "bg-orange-100",
        };
      case "infant":
        return {
          label: t("infant"),
          icon: <MdChildFriendly size={14} className="text-purple-500" />,
          bgColor: "bg-purple-100",
        };
      default:
        return {
          label: "",
          icon: null,
          bgColor: "",
        };
    }
  };

  // Track per-type counters for display
  let adultCounter = 0;
  let childCounter = 0;
  let infantCounter = 0;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-11 pt-10"
    >
      {/* ===== Passenger Information Section ===== */}
      <div className="">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[20px] leading-none font-bold text-slate-900">
            Who&apos;s traveling?
          </h3>
          <p className="text-[16px] text-gray-600">
            <span className="text-primary">✓</span>{" "}
            <span className="text-blue-500">Sign in</span> for effortless
            booking
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {defaultPassengers.map((passenger, pIdx) => {
            const typeInfo = getPassengerTypeInfo(passenger.type);
            let displayNum = 0;
            if (passenger.type === "adult") displayNum = ++adultCounter;
            else if (passenger.type === "child") displayNum = ++childCounter;
            else displayNum = ++infantCounter;

            const genderValue = watch(`passengers.${pIdx}.gender`) || "male";

            return (
              <div
                key={pIdx}
                className="bg-white border border-gray-100 rounded-lg p-4 md:p-5 flex flex-col gap-4"
              >
                <h4 className="text-[18px] font-bold text-slate-900">
                  Passenger
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FloatingLabelInput
                    id={`passengers.${pIdx}.firstName`}
                    label="Given names *"
                    register={register(`passengers.${pIdx}.firstName`)}
                    watchValue={watch(`passengers.${pIdx}.firstName`)}
                    error={errors.passengers?.[pIdx]?.firstName?.message}
                    inputClassName="font-medium text-slate-900"
                    containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                    labelClassName="font-medium text-slate-500"
                  />

                  <FloatingLabelInput
                    id={`passengers.${pIdx}.lastName`}
                    label="Last name (surname) *"
                    register={register(`passengers.${pIdx}.lastName`)}
                    watchValue={watch(`passengers.${pIdx}.lastName`)}
                    error={errors.passengers?.[pIdx]?.lastName?.message}
                    inputClassName="font-medium text-slate-900"
                    containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                    labelClassName="font-medium text-slate-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <div className="relative flex items-center px-3 bg-white transition-all duration-300 h-[68px] border border-[#d7dce3] rounded-lg">
                      <label
                        className="absolute -top-2.5 text-[12px] text-black/50 font-medium  
                       bg-white rounded-md px-2 pointer-events-none"
                      >
                        Gender on ID *
                      </label>
                      <select
                        value={genderValue}
                        onChange={(e) =>
                          setValue(
                            `passengers.${pIdx}.gender`,
                            e.target.value as "male" | "female",
                          )
                        }
                        className="w-full mt-4 text-start font-medium text-slate-900 bg-transparent border-none outline-none"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>

                  <FloatingLabelInput
                    id={`passengers.${pIdx}.dateOfBirth`}
                    label="Date of birth *"
                    type="date"
                    register={register(`passengers.${pIdx}.dateOfBirth`)}
                    watchValue={watch(`passengers.${pIdx}.dateOfBirth`)}
                    selectedDate={
                      watch(`passengers.${pIdx}.dateOfBirth`)
                        ? new Date(watch(`passengers.${pIdx}.dateOfBirth`))
                        : null
                    }
                    onDateChange={(date) => {
                      if (date) {
                        const formatted = date.toISOString().split("T")[0];
                        setValue(`passengers.${pIdx}.dateOfBirth`, formatted);
                      } else {
                        setValue(`passengers.${pIdx}.dateOfBirth`, "");
                      }
                    }}
                    isRTL={isRTL}
                    error={errors.passengers?.[pIdx]?.dateOfBirth?.message}
                    maxDate={new Date()}
                    containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                    labelClassName="font-medium text-slate-500"
                  />

                  <NationalitySelect
                    form={form as any}
                    name={`passengers.${pIdx}.nationality`}
                    label="Nationality (country/region) *"
                    required
                    error={errors.passengers?.[pIdx]?.nationality?.message}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="relative flex items-center px-3 bg-white transition-all duration-300 h-[68px] border border-[#d7dce3] rounded-lg">
                      <label className="absolute top-1 font-medium text-slate-500 pointer-events-none">
                        ID type *
                      </label>
                      <select
                        value={idTypeByPassenger[pIdx] || ""}
                        onChange={(e) => {
                          setIdTypeByPassenger((prev) =>
                            prev.map((item, idx) =>
                              idx === pIdx ? e.target.value : item,
                            ),
                          );
                        }}
                        className="w-full mt-4 text-start font-medium text-slate-900 bg-transparent border-none outline-none"
                      >
                        <option value="" disabled>
                          Select
                        </option>
                        <option value="passport">Passport</option>
                        <option value="nationalId">National ID</option>
                        <option value="residencePermit">
                          Residence permit
                        </option>
                      </select>
                    </div>
                  </div>

                  <FloatingLabelInput
                    id={`passengers.${pIdx}.passportNumber`}
                    label="ID number *"
                    register={register(`passengers.${pIdx}.passportNumber`)}
                    watchValue={watch(`passengers.${pIdx}.passportNumber`)}
                    error={errors.passengers?.[pIdx]?.passportNumber?.message}
                    inputClassName="font-medium text-slate-900"
                    containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                    labelClassName="font-medium text-slate-500"
                  />
                </div>

                <div className="rounded-lg bg-gray-100 px-4 py-3 text-[12px] text-gray-600">
                  . Enter passenger&apos;s name exactly as it appears on their
                  ID
                </div>

                <div className="flex justify-end text-[14px] text-gray-600">
                  Frequent flyer program (optional)
                </div>

                <Button size="lg" type="button">
                  Save &amp; add passenger
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Contact Information Section ===== */}
      <div className=" mt-6">
        <div className="flex items-center gap-2 mb-5">
          <h3 className="text-[20px] leading-none font-bold text-slate-900">
            Contact details
          </h3>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-4
              bg-white
              border border-gray-100 rounded-lg p-5
              "
        >
          <FloatingLabelInput
            id="fullName"
            label="Contact name *"
            register={register("fullName")}
            watchValue={watchFullName}
            error={errors.fullName?.message}
            inputClassName="font-medium text-slate-900"
            containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
            labelClassName="font-medium text-slate-500"
          />

          <FloatingLabelInput
            id="email"
            label="Email *"
            type="email"
            register={register("email")}
            watchValue={watchEmail}
            error={errors.email?.message}
            inputClassName="font-medium text-slate-900"
            containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
            labelClassName="font-medium text-slate-500"
          />

          <div className="relative">
            <div className="relative h-[58px] border border-gray-300 rounded-md bg-white px-3">
              <label
                htmlFor="phone"
                className="absolute -top-2.5 text-[12px] text-black/50 font-medium  
                       bg-white rounded-md px-2 pointer-events-none"
              >
                Mobile phone *
              </label>

              <div className="h-full flex items-center gap-3 pt-2">
                <button
                  type="button"
                  className="shrink-0 h-9 px-1 text-slate-900 font-medium border-none outline-none bg-transparent"
                >
                  +1
                </button>

                <div className="h-7 w-px bg-[#d7dce3]" />

                <input
                  id="phone"
                  type="text"
                  className="w-full text-start font-medium text-slate-900 bg-transparent border-none outline-none p-0"
                  {...register("phone")}
                />
              </div>
            </div>
            {errors.phone?.message && (
              <p
                title={errors.phone.message}
                className="absolute -bottom-4 start-4 text-xs text-red-500 font-medium line-clamp-1"
              >
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-xl text-16 font-bold text-white"
      >
        {isSubmitting ? t("submitting") : t("bookNow")}
      </Button>
    </form>
  );
}
