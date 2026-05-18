"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import PhoneInput from "@/components/shared/form/PhoneInput";
import loginImage1 from "@/public/images/login/login.png";
import loginImage2 from "@/public/images/login/login2.png";
import loginImage3 from "@/public/images/login/login3.png";
import loginImage5 from "@/public/images/login/login5.png";
import loginImage6 from "@/public/images/login/login6.png";
import loginImage7 from "@/public/images/login/login7.png";
import {
  useLoginMutation,
  useSendOtpMutation,
} from "@/redux/features/auth/authApi";
import { Button } from "@/components/ui/button";

interface LoginFormValues {
  phone: string;
  otp: string;
}

export default function LoginPage() {
  const t = useTranslations("NewPage.login");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const redirectAfterLogin =
    returnTo && returnTo.startsWith("/") ? returnTo : `/${locale}`;

  useEffect(() => {
    if (getCookie("auth-token")) {
      router.replace(redirectAfterLogin);
    }
  }, [redirectAfterLogin, router]);

  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [serverError, setServerError] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [loginMeta, setLoginMeta] = useState<{
    field: string;
    type: "EMAIL" | "PHONE";
  } | null>(null);
  const [login, { isLoading }] = useLoginMutation();
  const [sendOtp, { isLoading: isVerifyingOtp }] = useSendOtpMutation();
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onTouched",
    defaultValues: {
      phone: "",
      otp: "",
    },
  });

  useEffect(() => {
    if (step !== "otp") return;
    const frameId = requestAnimationFrame(() => {
      otpRefs.current[0]?.focus();
    });
    return () => cancelAnimationFrame(frameId);
  }, [step]);

  const onIdentifierSubmit = async (values: LoginFormValues) => {
    setServerError("");
    const normalizedPhone = values.phone.trim();

    const sendData = {
      login: `+${normalizedPhone.replace(/^\+/, "")}`,
      type: "PHONE" as const,
    };

    try {
      await login(sendData).unwrap();
      setLoginMeta({ field: sendData.login, type: "PHONE" });
      setStep("otp");
      setValue("otp", "");
      setOtpDigits(["", "", "", ""]);
    } catch (error: any) {
      setServerError(error?.data?.message || t("errors.failedToSendOtp"));
    }
  };

  const handleOtpChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "").slice(0, 1);
    const updatedDigits = [...otpDigits];
    updatedDigits[index] = value;
    setOtpDigits(updatedDigits);
    setValue("otp", updatedDigits.join(""), { shouldValidate: true });

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onOtpSubmit = async (values: LoginFormValues) => {
    if (!loginMeta) return;
    setServerError("");

    try {
      await sendOtp({
        field: loginMeta.field.replace("+", ""),
        otp: values.otp.trim(),
        type: loginMeta.type,
      }).unwrap();
      router.replace(redirectAfterLogin);
    } catch (error: any) {
      setServerError(error?.data?.message || t("errors.invalidOtp"));
    }
  };

  return (
    <section className="h-screen overflow-hidden ">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="relative hidden lg:block">
          <Image
            src={loginImage1}
            alt="Travel background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative flex items-center justify-center  p-5 lg:p-8">
          <Image
            src={loginImage2}
            alt="Decorative landmark left"
            className="pointer-events-none absolute bottom-0 start-0 h-auto w-[180px] "
            priority
          />
          <Image
            src={loginImage3}
            alt="Decorative landmark right"
            className="pointer-events-none absolute bottom-0 end-0 h-auto w-[170px] "
            priority
          />

          <div className="relative z-10 w-full max-w-[460px] pb-16 pt-8">
            <h1 className="text-center text-5xl font-extrabold text-primary">
              {t("welcome")}
            </h1>
            <p className="mt-1 text-center text-base font-medium text-gray-400">
              {step === "identifier"
                ? t("subtitle.identifier")
                : t("subtitle.otp")}
            </p>

            <form
              onSubmit={handleSubmit(
                step === "identifier" ? onIdentifierSubmit : onOtpSubmit,
              )}
              className="mt-10 flex flex-col gap-8"
            >
              {step === "identifier" ? (
                <div>
                  <PhoneInput
                    value={watch("phone")}
                    label={t("fields.identifier.label")}
                    error={errors.phone?.message}
                    defaultCountryCode="sa"
                    onChange={(phone, _dialCode, isValid) => {
                      setValue("phone", isValid ? phone : "", {
                        shouldValidate: true,
                      });
                    }}
                  />
                  <input
                    type="hidden"
                    {...register("phone", {
                      required: t("validation.identifierRequired"),
                      validate: (value) => {
                        const digits = value.trim().replace(/\D/g, "");
                        return (
                          (digits.length >= 8 && digits.length <= 15) ||
                          t("validation.identifierInvalid")
                        );
                      },
                    })}
                  />
                </div>
              ) : (
                <div className="space-y-2 w-fit mx-auto">
                  <p className="text-sm font-medium text-primary">
                    {t("fields.otp.label")}
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={(event) =>
                          handleOtpChange(index, event.target.value)
                        }
                        onKeyDown={(event) => handleOtpKeyDown(index, event)}
                        className="h-14 w-14 rounded-lg border border-[#1aa4ea] bg-white text-center text-xl font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    ))}
                  </div>
                  <input
                    type="hidden"
                    {...register("otp", {
                      required: t("validation.otpRequired"),
                      pattern: {
                        value: /^\d{4}$/,
                        message: t("validation.otpInvalid"),
                      },
                    })}
                  />
                  {errors.otp?.message ? (
                    <p className="text-sm font-medium text-red-500">
                      {errors.otp.message}
                    </p>
                  ) : null}
                </div>
              )}

              {serverError ? (
                <p className="-mt-5 text-center text-sm font-medium text-red-500">
                  {serverError}
                </p>
              ) : null}

              {step === "otp" ? (
                <button
                  type="button"
                  onClick={() => setStep("identifier")}
                  className="-mt-4 text-center text-sm font-medium text-primary hover:underline"
                >
                  {t("actions.changeIdentifier")}
                </button>
              ) : null}

              <Button
                type="submit"
                disabled={isLoading || isVerifyingOtp}
                className="w-full max-w-64 mx-auto h-12 rounded-md  "
              >
                {step === "identifier"
                  ? isLoading
                    ? t("actions.sendingOtp")
                    : t("actions.sendOtp")
                  : isVerifyingOtp
                    ? t("actions.verifying")
                    : t("actions.verifyOtp")}
              </Button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-base font-medium text-gray-500">
                {t("or")}
              </span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[loginImage5, loginImage6, loginImage7].map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className="h-16 flex rounded-xl bg-primary/10 items-center justify-center hover:bg-primary/20 transition"
                >
                  <Image
                    src={image}
                    alt={t("socialLoginAlt")}
                    width={500}
                    height={500}
                    className="object-cover max-w-8"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
