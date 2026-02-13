"use client";

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

// Gender Selector Component
function GenderSelector({
  value,
  onChange,
  t,
  passengerIndex,
}: {
  value: "male" | "female";
  onChange: (val: "male" | "female") => void;
  t: ReturnType<typeof useTranslations>;
  passengerIndex: number;
}) {
  const genders: { value: "male" | "female"; label: string }[] = [
    { value: "male", label: t("male") },
    { value: "female", label: t("female") },
  ];

  return (
    <div className="flex gap-3">
      {genders.map((item) => (
        <label
          key={item.value}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            name={`gender-selector-${passengerIndex}`}
            checked={value === item.value}
            onChange={() => onChange(item.value)}
            className="w-5 h-5 accent-primary cursor-pointer"
          />
          <span className="text-14 font-medium text-gray-700">
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
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

  const totalPassengers = adults + childrenCount + infants;

  // Build default passengers array
  const defaultPassengers: FlightPassengerData[] = [];
  for (let i = 0; i < adults; i++) {
    defaultPassengers.push({
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
    defaultPassengers.push({
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
    defaultPassengers.push({
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
      })
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* ===== Contact Information Section ===== */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
          <MdPerson size={18} className="text-primary" />
          <h3 className="text-16 font-bold">{t("contactInfo")}</h3>
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-5">
          {/* Full Name */}
          <FloatingLabelInput
            id="fullName"
            label={t("fullName")}
            register={register("fullName")}
            watchValue={watchFullName}
            error={errors.fullName?.message}
            icon={<FaUser size={14} />}
          />

          {/* Email */}
          <FloatingLabelInput
            id="email"
            label={t("email")}
            type="email"
            register={register("email")}
            watchValue={watchEmail}
            error={errors.email?.message}
            icon={<MdEmail size={16} />}
          />

          {/* Phone */}
          <FloatingLabelInput
            id="phone"
            label={t("phone")}
            type="text"
            register={register("phone")}
            watchValue={watchPhone}
            error={errors.phone?.message}
            icon={<MdPhone size={16} />}
          />
        </div>
      </div>

      {/* ===== Passenger Information Section ===== */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
          <FaUser size={16} className="text-primary" />
          <h3 className="text-16 font-bold">{t("passengerInfo")}</h3>
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-6">
          {defaultPassengers.map((passenger, pIdx) => {
            const typeInfo = getPassengerTypeInfo(passenger.type);
            let displayNum = 0;
            if (passenger.type === "adult") displayNum = ++adultCounter;
            else if (passenger.type === "child") displayNum = ++childCounter;
            else displayNum = ++infantCounter;

            const genderValue = watch(`passengers.${pIdx}.gender`);

            return (
              <div
                key={pIdx}
                className="border border-gray-200 rounded-xl p-4 flex flex-col gap-4"
              >
                {/* Passenger Header */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${typeInfo.bgColor}`}
                  >
                    {typeInfo.icon}
                  </div>
                  <span className="text-14 font-bold text-gray-700">
                    {typeInfo.label} {displayNum}
                  </span>
                </div>

                {/* First Name & Last Name */}

                <FloatingLabelInput
                  id={`passengers.${pIdx}.firstName`}
                  label={t("firstName")}
                  register={register(`passengers.${pIdx}.firstName`)}
                  watchValue={watch(`passengers.${pIdx}.firstName`)}
                  error={errors.passengers?.[pIdx]?.firstName?.message}
                  icon={<FaUser size={14} />}
                />


                <FloatingLabelInput
                  id={`passengers.${pIdx}.lastName`}
                  label={t("lastName")}
                  register={register(`passengers.${pIdx}.lastName`)}
                  watchValue={watch(`passengers.${pIdx}.lastName`)}
                  error={errors.passengers?.[pIdx]?.lastName?.message}
                  icon={<FaUser size={14} />}
                />

                {/* Date of Birth */}
                <FloatingLabelInput
                  id={`passengers.${pIdx}.dateOfBirth`}
                  label={t("dateOfBirth")}
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
                />

                {/* Gender */}
                <div>
                  <h4 className="text-14 font-bold text-gray-700 mb-2">
                    {t("gender")}
                  </h4>
                  <GenderSelector
                    value={genderValue || "male"}
                    onChange={(val) =>
                      setValue(`passengers.${pIdx}.gender`, val)
                    }
                    t={t}
                    passengerIndex={pIdx}
                  />
                </div>

                {/* Documents Section */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FaPassport size={14} className="text-primary" />
                    <h4 className="text-14 font-bold text-gray-700">
                      {t("documents")}
                    </h4>
                  </div>

                  {/* Passport Number */}
                  <div className="flex flex-col gap-4">
                    <FloatingLabelInput
                      id={`passengers.${pIdx}.passportNumber`}
                      label={t("passportNumber")}
                      register={register(
                        `passengers.${pIdx}.passportNumber`
                      )}
                      watchValue={watch(
                        `passengers.${pIdx}.passportNumber`
                      )}
                      error={
                        errors.passengers?.[pIdx]?.passportNumber?.message
                      }
                      icon={<FaPassport size={14} />}
                    />

                    {/* Nationality */}
                    <NationalitySelect
                      form={form as any}
                      name={`passengers.${pIdx}.nationality`}
                      label={t("nationality")}
                      required
                      error={
                        errors.passengers?.[pIdx]?.nationality?.message
                      }
                    />

                    {/* Passport Expiry */}
                    <FloatingLabelInput
                      id={`passengers.${pIdx}.passportExpiry`}
                      label={t("passportExpiry")}
                      type="date"
                      register={register(
                        `passengers.${pIdx}.passportExpiry`
                      )}
                      watchValue={watch(`passengers.${pIdx}.passportExpiry`)}
                      selectedDate={
                        watch(`passengers.${pIdx}.passportExpiry`)
                          ? new Date(
                            watch(`passengers.${pIdx}.passportExpiry`)
                          )
                          : null
                      }
                      onDateChange={(date) => {
                        if (date) {
                          const formatted = date.toISOString().split("T")[0];
                          setValue(
                            `passengers.${pIdx}.passportExpiry`,
                            formatted
                          );
                        } else {
                          setValue(`passengers.${pIdx}.passportExpiry`, "");
                        }
                      }}
                      isRTL={isRTL}
                      error={
                        errors.passengers?.[pIdx]?.passportExpiry?.message
                      }
                      minDate={new Date()}
                    />
                  </div>
                </div>
              </div>
            );
          })}
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
