"use client";

import type { UseFormReturn } from "react-hook-form";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import type { FlightBookingFormValues } from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm";
import { useTranslations } from "next-intl";
import PhoneInput from "@/components/shared/form/PhoneInput";

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

        <div>
          <PhoneInput
            value={watch("phone")}
            label={t("mobilePhone")}
            error={errors.phone?.message}
            defaultCountryCode="eg"
            onChange={(phone, dialCode, isValid) => {
              setValue("phone", isValid ? phone : "", {
                shouldValidate: true,
              });
              setValue("phoneCountryCode", dialCode, {
                shouldValidate: true,
              });
            }}
          />
          <input type="hidden" {...register("phone")} />
          <input type="hidden" {...register("phoneCountryCode")} />
        </div>
      </div>
    </div>
  );
}
