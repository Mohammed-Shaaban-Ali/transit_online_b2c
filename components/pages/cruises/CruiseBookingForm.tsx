"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocale, useTranslations } from "next-intl";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import PhoneInput from "@/components/shared/form/PhoneInput";
import NationalitySelect from "@/components/shared/NationalitySelect";
import type { CruiseCabinGuestSlot } from "@/types/cruiseTypes";
import { buildOrderedGuestRefs } from "@/utils/cruiseCabinHelpers";
import { cn } from "@/lib/utils";

export type CruiseGuestFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "male" | "female";
  nationality: string;
  type: "adult" | "child" | "infant";
  guestRefNumber: number;
  cabinIndex: number;
};

export type CruiseBookingFormValues = {
  fullName: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  guests: CruiseGuestFormData[];
};

type Props = {
  guestSlots: CruiseCabinGuestSlot[];
  onSubmit: (data: CruiseBookingFormValues) => void;
};

function mapSlotType(type: CruiseCabinGuestSlot["type"]): CruiseGuestFormData["type"] {
  if (type === "CHD") return "child";
  if (type === "INF") return "infant";
  return "adult";
}

export default function CruiseBookingForm({ guestSlots, onSubmit }: Props) {
  const t = useTranslations("CruiseBooking");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const defaultGuests = useMemo(() => {
    return buildOrderedGuestRefs(guestSlots).map((slot) => ({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male" as const,
      nationality: "",
      type: mapSlotType(slot.type),
      guestRefNumber: slot.guestRefNumber,
      cabinIndex: slot.cabinIndex,
    }));
  }, [guestSlots]);

  const schema = useMemo(
    () =>
      z.object({
        fullName: z.string().trim().min(3, t("errors.fullName")),
        email: z.string().trim().email(t("errors.email")),
        phone: z.string().trim().min(6, t("errors.phone")),
        phoneCountryCode: z.string().trim().min(1, t("errors.phone")),
        guests: z.array(
          z.object({
            firstName: z.string().trim().min(1, t("errors.firstName")),
            lastName: z.string().trim().min(1, t("errors.lastName")),
            dateOfBirth: z.string().trim().min(1, t("errors.birthDate")),
            gender: z.enum(["male", "female"]),
            nationality: z.string().trim().min(1, t("errors.nationality")),
            type: z.enum(["adult", "child", "infant"]),
            guestRefNumber: z.number(),
            cabinIndex: z.number(),
          }),
        ),
      }),
    [t],
  );

  const form = useForm<CruiseBookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      phoneCountryCode: "20",
      guests: defaultGuests,
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;

  const guestTypeLabel = (type: CruiseGuestFormData["type"]) => {
    if (type === "child") return t("child");
    if (type === "infant") return t("infant");
    return t("adult");
  };

  return (
    <form
      id="cruise-booking-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
        <h3 className="mb-4 text-lg font-bold text-gray-900 md:text-xl">
          {t("contactTitle")}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FloatingLabelInput
            id="fullName"
            label={t("fullName")}
            register={register("fullName")}
            watchValue={watch("fullName")}
            error={errors.fullName?.message}
            inputClassName="font-bold text-slate-900"
            containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-xl"
            labelClassName="font-bold text-slate-500"
          />
          <FloatingLabelInput
            id="email"
            label={t("email")}
            type="email"
            register={register("email")}
            watchValue={watch("email")}
            error={errors.email?.message}
            inputClassName="font-bold text-slate-900"
            containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-xl"
            labelClassName="font-bold text-slate-500"
          />
          <div>
            <PhoneInput
              value={watch("phone")}
              label={t("phone")}
              error={errors.phone?.message}
              defaultCountryCode="sa"
              onChange={(phone, dialCode, isValid) => {
                setValue("phone", isValid ? phone : "", { shouldValidate: true });
                setValue("phoneCountryCode", dialCode, { shouldValidate: true });
              }}
            />
            <input type="hidden" {...register("phone")} />
            <input type="hidden" {...register("phoneCountryCode")} />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
        <h3 className="mb-4 text-lg font-bold text-gray-900 md:text-xl">
          {t("guestsTitle")}
        </h3>

        <div className="space-y-6">
          {defaultGuests.map((guest, index) => {
            const genderValue = watch(`guests.${index}.gender`) || "male";
            return (
              <div
                key={guest.guestRefNumber}
                className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
              >
                <h4 className="mb-4 text-base font-bold text-primary">
                  {t("guestLabel", {
                    number: index + 1,
                    type: guestTypeLabel(guest.type),
                  })}
                </h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FloatingLabelInput
                    id={`guests.${index}.firstName`}
                    label={t("firstName")}
                    register={register(`guests.${index}.firstName`)}
                    watchValue={watch(`guests.${index}.firstName`)}
                    error={errors.guests?.[index]?.firstName?.message}
                    inputClassName="font-bold text-slate-900"
                    containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-xl"
                    labelClassName="font-bold text-slate-500"
                  />
                  <FloatingLabelInput
                    id={`guests.${index}.lastName`}
                    label={t("lastName")}
                    register={register(`guests.${index}.lastName`)}
                    watchValue={watch(`guests.${index}.lastName`)}
                    error={errors.guests?.[index]?.lastName?.message}
                    inputClassName="font-bold text-slate-900"
                    containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-xl"
                    labelClassName="font-bold text-slate-500"
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FloatingLabelInput
                    id={`guests.${index}.dateOfBirth`}
                    label={t("birthDate")}
                    type="date"
                    register={register(`guests.${index}.dateOfBirth`)}
                    watchValue={watch(`guests.${index}.dateOfBirth`)}
                    selectedDate={
                      watch(`guests.${index}.dateOfBirth`)
                        ? new Date(watch(`guests.${index}.dateOfBirth`))
                        : null
                    }
                    onDateChange={(date) => {
                      if (date) {
                        const formatted = date.toISOString().split("T")[0];
                        setValue(`guests.${index}.dateOfBirth`, formatted, {
                          shouldValidate: true,
                        });
                      } else {
                        setValue(`guests.${index}.dateOfBirth`, "", {
                          shouldValidate: true,
                        });
                      }
                    }}
                    isRTL={isRTL}
                    maxDate={new Date()}
                    error={errors.guests?.[index]?.dateOfBirth?.message}
                    inputClassName="font-bold text-slate-900"
                    containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-xl"
                    labelClassName="font-bold text-slate-500"
                  />

                  <NationalitySelect
                    form={form as never}
                    name={`guests.${index}.nationality`}
                    label={t("nationality")}
                    required
                    error={errors.guests?.[index]?.nationality?.message}
                  />
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-bold text-gray-800">
                    {t("gender")}
                  </p>
                  <div className="flex items-center gap-5">
                    {(["male", "female"] as const).map((value) => (
                      <label
                        key={value}
                        className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-gray-800"
                      >
                        <span
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full border",
                            genderValue === value
                              ? "border-primary"
                              : "border-gray-300",
                          )}
                        >
                          {genderValue === value && (
                            <span className="size-2.5 rounded-full bg-primary" />
                          )}
                        </span>
                        <input
                          type="radio"
                          className="sr-only"
                          checked={genderValue === value}
                          onChange={() =>
                            setValue(`guests.${index}.gender`, value, {
                              shouldValidate: true,
                            })
                          }
                        />
                        {value === "male" ? t("male") : t("female")}
                      </label>
                    ))}
                  </div>
                </div>

                <input
                  type="hidden"
                  {...register(`guests.${index}.type`)}
                />
                <input
                  type="hidden"
                  {...register(`guests.${index}.guestRefNumber`, {
                    valueAsNumber: true,
                  })}
                />
                <input
                  type="hidden"
                  {...register(`guests.${index}.cabinIndex`, {
                    valueAsNumber: true,
                  })}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Keep RTL awareness available for future field tweaks */}
      <span className="sr-only">{isRTL ? "rtl" : "ltr"}</span>
    </form>
  );
}
