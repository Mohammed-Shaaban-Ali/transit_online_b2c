"use client";

import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import { Button } from "@/components/ui/button";
import NationalitySelect from "@/components/shared/NationalitySelect";
import { useTranslations } from "next-intl";
import type {
  FlightBookingFormValues,
  FlightPassengerData,
} from "@/components/pages/flights-test/FlightBookingPage/FlightBookingForm";

interface PassengerInformationSectionProps {
  defaultPassengers: FlightPassengerData[];
  form: UseFormReturn<FlightBookingFormValues>;
  isRTL: boolean;
  idTypeByPassenger: string[];
  setIdTypeByPassenger: Dispatch<SetStateAction<string[]>>;
}

export default function PassengerInformationSection({
  defaultPassengers,
  form,
  isRTL,
  idTypeByPassenger,
  setIdTypeByPassenger,
}: PassengerInformationSectionProps) {
  const t = useTranslations("FlightBookingPageNested.passengerInformation");
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-28 leading-none font-bold ">
          {t("title")}
        </h3>
        <p className="text-[16px] text-gray-600">
          <span className="text-primary">✓</span>{" "}
          <span className="text-blue-500">{t("signIn")}</span>{" "}
          {t("signInSuffix")}
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {defaultPassengers.map((_, pIdx) => {
          const genderValue = watch(`passengers.${pIdx}.gender`) || "male";

          return (
            <div
              key={pIdx}
              className="flex flex-col gap-4 rounded-lg border border-gray-100 bg-white p-4 md:p-5"
            >
              <h4 className="text-[18px] font-bold text-slate-900">
                {t("passenger")}
              </h4>

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
                  <div className="relative flex h-[68px] items-center rounded-lg border border-[#d7dce3] bg-white px-3 transition-all duration-300">
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
                <div className="relative">
                  <div className="relative flex h-[68px] items-center rounded-lg border border-[#d7dce3] bg-white px-3 transition-all duration-300">
                    <label className="pointer-events-none absolute top-1 font-medium text-slate-500">
                      {t("idType")}
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
                      className="mt-4 w-full border-none bg-transparent text-start font-medium text-slate-900 outline-none"
                    >
                      <option value="" disabled>
                        {t("select")}
                      </option>
                      <option value="passport">{t("passport")}</option>
                      <option value="nationalId">{t("nationalId")}</option>
                      <option value="residencePermit">
                        {t("residencePermit")}
                      </option>
                    </select>
                  </div>
                </div>

                <FloatingLabelInput
                  id={`passengers.${pIdx}.passportNumber`}
                  label={t("idNumber")}
                  register={register(`passengers.${pIdx}.passportNumber`)}
                  watchValue={watch(`passengers.${pIdx}.passportNumber`)}
                  error={errors.passengers?.[pIdx]?.passportNumber?.message}
                  inputClassName="font-medium text-slate-900"
                  containerClassName="h-[68px] bg-white border-[#d7dce3] rounded-lg"
                  labelClassName="font-medium text-slate-500"
                />
              </div>

              <div className="rounded-lg bg-gray-100 px-4 py-3 text-[12px] text-gray-600">
                {t("idHint")}
              </div>

              <div className="flex justify-end text-[14px] text-gray-600">
                {t("frequentFlyerProgram")}
              </div>

              <Button size="lg" type="button">
                {t("saveAndAddPassenger")}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
