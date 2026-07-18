"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import PhoneInput from "@/components/shared/form/PhoneInput";
import { Button } from "@/components/ui/button";
import LicenseFileUpload from "./LicenseFileUpload";
import type { LicenseBookingFormValues } from "./types";

interface LicenseBookingFormProps {
  isSubmitting?: boolean;
  onSubmit: (data: LicenseBookingFormValues) => void;
}

export default function LicenseBookingForm({
  isSubmitting = false,
  onSubmit,
}: LicenseBookingFormProps) {
  const t = useTranslations("LicenseBooking");

  const schema = z.object({
    name: z.string().min(2, t("validation.nameRequired")),
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    address: z.string().min(1, t("validation.addressRequired")),
    phone: z.string().min(8, t("validation.phoneInvalid")),
    phoneCountryCode: z.string().min(1),
    passportPhoto: z
      .custom<File | null>((val) => val instanceof File, {
        message: t("validation.passportRequired"),
      })
      .nullable()
      .refine((val) => val instanceof File, {
        message: t("validation.passportRequired"),
      }),
    localLicensePhoto: z
      .custom<File | null>((val) => val instanceof File, {
        message: t("validation.localLicenseRequired"),
      })
      .nullable()
      .refine((val) => val instanceof File, {
        message: t("validation.localLicenseRequired"),
      }),
    personalPhoto: z
      .custom<File | null>((val) => val instanceof File, {
        message: t("validation.personalPhotoRequired"),
      })
      .nullable()
      .refine((val) => val instanceof File, {
        message: t("validation.personalPhotoRequired"),
      }),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LicenseBookingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      phoneCountryCode: "+966",
      passportPhoto: null,
      localLicensePhoto: null,
      personalPhoto: null,
    },
  });

  return (
    <form
      id="license-booking-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-18 font-bold text-slate-900">
          {t("contactInfo")}
        </h2>
        <div className="space-y-4">
          <FloatingLabelInput
            id="license-name"
            label={t("fullName")}
            register={register("name")}
            watchValue={watch("name")}
            error={errors.name?.message}
            icon={<User className="h-4 w-4" />}
          />
          <FloatingLabelInput
            id="license-email"
            label={t("email")}
            type="email"
            register={register("email")}
            watchValue={watch("email")}
            error={errors.email?.message}
            icon={<Mail className="h-4 w-4" />}
          />
          <FloatingLabelInput
            id="license-address"
            label={t("nationalAddress")}
            register={register("address")}
            watchValue={watch("address")}
            error={errors.address?.message}
            icon={<MapPin className="h-4 w-4" />}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                label={t("phone")}
                value={field.value}
                defaultCountryCode="sa"
                error={errors.phone?.message}
                onChange={(phone, dialCode, isValid) => {
                  field.onChange(isValid ? phone : "");
                  setValue(
                    "phoneCountryCode",
                    dialCode.startsWith("+") ? dialCode : `+${dialCode}`,
                    {
                      shouldValidate: true,
                    },
                  );
                }}
              />
            )}
          />
          <input type="hidden" {...register("phoneCountryCode")} />
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-18 font-bold text-slate-900">
          {t("requiredFiles")}
        </h2>
        <div className="space-y-4">
          <Controller
            name="passportPhoto"
            control={control}
            render={({ field }) => (
              <LicenseFileUpload
                id="passportPhoto"
                label={t("passportPhoto")}
                hint={t("passportPhotoHint")}
                value={field.value}
                onChange={field.onChange}
                error={errors.passportPhoto?.message}
                disabled={isSubmitting}
              />
            )}
          />
          <Controller
            name="localLicensePhoto"
            control={control}
            render={({ field }) => (
              <LicenseFileUpload
                id="localLicensePhoto"
                label={t("localLicensePhoto")}
                hint={t("localLicensePhotoHint")}
                value={field.value}
                onChange={field.onChange}
                error={errors.localLicensePhoto?.message}
                disabled={isSubmitting}
              />
            )}
          />
          <Controller
            name="personalPhoto"
            control={control}
            render={({ field }) => (
              <LicenseFileUpload
                id="personalPhoto"
                label={t("personalPhoto")}
                hint={t("personalPhotoHint")}
                value={field.value}
                onChange={field.onChange}
                error={errors.personalPhoto?.message}
                variant="camera"
                disabled={isSubmitting}
              />
            )}
          />
        </div>
      </section>

      <Button type="submit" disabled={isSubmitting} className="h-12 w-full ">
        {isSubmitting ? t("submitting") : t("payNow")}
      </Button>
    </form>
  );
}
