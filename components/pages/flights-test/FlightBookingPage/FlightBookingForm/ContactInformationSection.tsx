"use client";

import type { UseFormReturn } from "react-hook-form";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import type { FlightBookingFormValues } from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm";
import { useTranslations } from "next-intl";

interface ContactInformationSectionProps {
  form: UseFormReturn<FlightBookingFormValues>;
}

export default function ContactInformationSection({
  form,
}: ContactInformationSectionProps) {
  const t = useTranslations("FlightBookingPageNested.contactInformation");
  const {
    register,
    watch,
    formState: { errors },
  } = form;

  return (
    <div className="mt-6">
      <div className="mb-5 flex items-center gap-2">
        <h3 className="text-28 leading-none font-bold text-slate-900">
          {t("title")}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-5 md:grid-cols-3">
        <FloatingLabelInput
          id="fullName"
          label={t("contactName")}
          register={register("fullName")}
          watchValue={watch("fullName")}
          error={errors.fullName?.message}
          inputClassName="font-medium text-slate-900"
          containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
          labelClassName="font-medium text-slate-500"
        />

        <FloatingLabelInput
          id="email"
          label={t("email")}
          type="email"
          register={register("email")}
          watchValue={watch("email")}
          error={errors.email?.message}
          inputClassName="font-medium text-slate-900"
          containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
          labelClassName="font-medium text-slate-500"
        />

        <div className="relative">
          <div className="relative h-[58px] rounded-md border border-gray-300 bg-white px-3">
            <label
              htmlFor="phone"
              className="pointer-events-none absolute -top-2.5 rounded-md bg-white px-2 text-[12px] font-medium text-black/50"
            >
              {t("mobilePhone")}
            </label>

            <div className="flex h-full items-center gap-3 pt-2">
              <button
                type="button"
                className="h-9 shrink-0 border-none bg-transparent px-1 font-medium text-slate-900 outline-none"
              >
                +20
              </button>

              <div className="h-7 w-px bg-[#d7dce3]" />

              <input
                id="phone"
                type="text"
                className="w-full border-none bg-transparent p-0 text-start font-medium text-slate-900 outline-none"
                {...register("phone")}
              />
            </div>
          </div>
          {errors.phone?.message && (
            <p
              title={errors.phone.message}
              className="absolute -bottom-4 start-4 line-clamp-1 text-xs font-medium text-red-500"
            >
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
