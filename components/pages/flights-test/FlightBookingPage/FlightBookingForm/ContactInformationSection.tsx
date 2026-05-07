"use client";

import type { UseFormReturn } from "react-hook-form";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import type { FlightBookingFormValues } from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm";
import { useTranslations } from "next-intl";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
    setValue,
    formState: { errors },
  } = form;

  return (
    <div className="mt-6">
      <div className="mb-5 flex items-center gap-2">
        <h3 className="text-24 leading-none font-bold text-slate-900">
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

        <div className="relative ">
          <label
            htmlFor="phone"
            className="pointer-events-none absolute -top-2 start-5 z-10 rounded-md bg-white px-2 text-[12px] font-medium text-black/50"
          >
            {t("mobilePhone")}
          </label>
          <PhoneInput
            country="eg"
            value={watch("phone").replace("+", "")}
            onChange={(value, country: { dialCode?: string }) => {
              const dialCode = (country?.dialCode || "20").replace(/\D/g, "");
              const normalizedPhone = value.replace(/^\+/, "");
              setValue("phone", `+${normalizedPhone}`, {
                shouldValidate: true,
              });
              setValue("phoneCountryCode", dialCode, {
                shouldValidate: true,
              });
            }}
            inputProps={{
              id: "phone",
              autoComplete: "tel",
              name: "phone",
            }}
            enableSearch
            containerClass="!w-full ![direction:ltr]"
            inputClass="!w-full !h-[58px] !pl-14 !pr-3 !rounded-md !border !border-gray-300 !text-slate-900 !font-medium !text-left"
            buttonClass="!border-gray-300 !bg-white !rounded-s-md "
            dropdownClass="!text-slate-900"
          />
          <input type="hidden" {...register("phone")} />
          <input type="hidden" {...register("phoneCountryCode")} />
          {errors.phone?.message && (
            <p
              title={errors.phone.message}
              className="line-clamp-1 text-xs font-medium text-red-500"
            >
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
