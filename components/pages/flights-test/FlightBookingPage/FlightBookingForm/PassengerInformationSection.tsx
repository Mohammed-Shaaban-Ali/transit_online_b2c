"use client";

import type { UseFormReturn } from "react-hook-form";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import NationalitySelect from "@/components/shared/NationalitySelect";
import PassportUpload from "@/components/shared/PassportUpload";
import { useTranslations } from "next-intl";
import type {
  FlightBookingFormValues,
  FlightPassengerData,
} from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm";
import type { MappedPassportFields } from "@/types/passportTypes";

interface PassengerInformationSectionProps {
  defaultPassengers: FlightPassengerData[];
  form: UseFormReturn<FlightBookingFormValues>;
  isRTL: boolean;
  minPassportExpiryDate: Date;
}

export default function PassengerInformationSection({
  defaultPassengers,
  form,
  isRTL,
  minPassportExpiryDate,
}: PassengerInformationSectionProps) {
  const t = useTranslations("FlightBookingPageNested.passengerInformation");
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const applyPassportFields = (
    passengerIndex: number,
    fields: MappedPassportFields,
  ) => {
    const options = { shouldDirty: true, shouldValidate: true } as const;

    setValue(`passengers.${passengerIndex}.firstName`, fields.firstName, options);
    setValue(`passengers.${passengerIndex}.lastName`, fields.lastName, options);
    setValue(
      `passengers.${passengerIndex}.dateOfBirth`,
      fields.dateOfBirth,
      options,
    );
    setValue(`passengers.${passengerIndex}.gender`, fields.gender, options);
    setValue(
      `passengers.${passengerIndex}.passportNumber`,
      fields.passportNumber,
      options,
    );
    setValue(
      `passengers.${passengerIndex}.nationality`,
      fields.nationality,
      options,
    );
    setValue(
      `passengers.${passengerIndex}.passportExpiry`,
      fields.passportExpiry,
      options,
    );
  };

  return (
    <div>
      <div className="mb-5 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-24 leading-none font-bold ">{t("title")}</h3>
        <p className="text-[16px] text-gray-600">
          <span className="text-primary">✓</span>{" "}
          <span className="text-blue-500">{t("signIn")}</span>{" "}
          {t("signInSuffix")}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {defaultPassengers.map((_, pIdx) => {
          const genderValue = watch(`passengers.${pIdx}.gender`) || "male";
          const passengerType = watch(`passengers.${pIdx}.type`) || "adult";

          return (
            <div
              key={pIdx}
              className="flex flex-col gap-8 rounded-lg border border-gray-100 bg-white p-4 md:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-[18px] font-bold text-slate-900">
                  {`Passenger ${pIdx + 1}`}
                </h4>
                <div className="flex items-center gap-2">
                  <PassportUpload
                    variant="compact"
                    onSuccess={(fields) => applyPassportFields(pIdx, fields)}
                  />
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                    {String(passengerType).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabelInput
                  id={`passengers.${pIdx}.firstName`}
                  label={t("givenNames")}
                  register={register(`passengers.${pIdx}.firstName`)}
                  watchValue={watch(`passengers.${pIdx}.firstName`)}
                  error={errors.passengers?.[pIdx]?.firstName?.message}
                  inputClassName="font-medium text-slate-900"
                  containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                  labelClassName="font-medium text-slate-500"
                />

                <FloatingLabelInput
                  id={`passengers.${pIdx}.lastName`}
                  label={t("lastName")}
                  register={register(`passengers.${pIdx}.lastName`)}
                  watchValue={watch(`passengers.${pIdx}.lastName`)}
                  error={errors.passengers?.[pIdx]?.lastName?.message}
                  inputClassName="font-medium text-slate-900"
                  containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                  labelClassName="font-medium text-slate-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="relative">
                  <div className="relative flex h-16! items-center rounded-lg border border-[#d7dce3] bg-white px-3 transition-all duration-300">
                    <label className="pointer-events-none absolute -top-2.5 rounded-md bg-white px-2 text-[12px] font-medium text-black/50">
                      {t("genderOnId")}
                    </label>
                    <select
                      value={genderValue}
                      onChange={(e) =>
                        setValue(
                          `passengers.${pIdx}.gender`,
                          e.target.value as "male" | "female",
                        )
                      }
                      className="mt-4 w-full border-none bg-transparent text-start font-medium text-slate-900 outline-none"
                    >
                      <option value="male">{t("male")}</option>
                      <option value="female">{t("female")}</option>
                    </select>
                  </div>
                </div>

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
                  containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                  labelClassName="font-medium text-slate-500"
                />

                <NationalitySelect
                  form={form}
                  name={`passengers.${pIdx}.nationality`}
                  label={t("nationality")}
                  required
                  error={errors.passengers?.[pIdx]?.nationality?.message}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatingLabelInput
                  id={`passengers.${pIdx}.passportNumber`}
                  label={t("passportNumber")}
                  register={register(`passengers.${pIdx}.passportNumber`)}
                  watchValue={watch(`passengers.${pIdx}.passportNumber`)}
                  error={errors.passengers?.[pIdx]?.passportNumber?.message}
                  inputClassName="font-medium text-slate-900"
                  containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                  labelClassName="font-medium text-slate-500"
                />{" "}
                <FloatingLabelInput
                  id={`passengers.${pIdx}.passportExpiry`}
                  label={t("passportExpiry")}
                  type="date"
                  register={register(`passengers.${pIdx}.passportExpiry`)}
                  watchValue={watch(`passengers.${pIdx}.passportExpiry`)}
                  selectedDate={
                    watch(`passengers.${pIdx}.passportExpiry`)
                      ? new Date(watch(`passengers.${pIdx}.passportExpiry`))
                      : null
                  }
                  onDateChange={(date) => {
                    if (date) {
                      const formatted = date.toISOString().split("T")[0];
                      setValue(`passengers.${pIdx}.passportExpiry`, formatted);
                    } else {
                      setValue(`passengers.${pIdx}.passportExpiry`, "");
                    }
                  }}
                  isRTL={isRTL}
                  error={errors.passengers?.[pIdx]?.passportExpiry?.message}
                  minDate={minPassportExpiryDate}
                  containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                  labelClassName="font-medium text-slate-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
