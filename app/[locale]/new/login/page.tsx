"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCookie } from "cookies-next";
import { useForm } from "react-hook-form";
import { Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
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
  identifier: string;
  otp: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const redirectAfterLogin =
    returnTo && returnTo.startsWith("/") ? returnTo : "/new";

  useEffect(() => {
    if (getCookie("auth-token")) {
      router.replace(redirectAfterLogin);
    }
  }, [redirectAfterLogin, router]);

  const [step, setStep] = useState<"identifier" | "otp">("identifier");
  const [serverError, setServerError] = useState("");
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
      identifier: "",
      otp: "",
    },
  });

  const onIdentifierSubmit = async (values: LoginFormValues) => {
    setServerError("");
    const normalizedIdentifier = values.identifier.trim();
    const loginType: "EMAIL" | "PHONE" = normalizedIdentifier.includes("@")
      ? "EMAIL"
      : "PHONE";

    const sendData = {
      login: normalizedIdentifier,
      type: loginType,
    };

    try {
      await login(sendData).unwrap();
      setLoginMeta({ field: normalizedIdentifier, type: loginType });
      setStep("otp");
      setValue("otp", "");
    } catch (error: any) {
      setServerError(error?.data?.message || "Failed to send OTP");
    }
  };

  const onOtpSubmit = async (values: LoginFormValues) => {
    if (!loginMeta) return;
    setServerError("");

    try {
      await sendOtp({
        field: loginMeta.field,
        otp: values.otp.trim(),
        type: loginMeta.type,
      }).unwrap();
      router.replace(redirectAfterLogin);
    } catch (error: any) {
      setServerError(error?.data?.message || "Invalid OTP, please try again");
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
              Welcome
            </h1>
            <p className="mt-1 text-center text-base font-medium text-gray-400">
              {step === "identifier"
                ? "Login with your email or phone number"
                : "Enter the 4-digit OTP sent to your email or phone"}
            </p>

            <form
              onSubmit={handleSubmit(
                step === "identifier" ? onIdentifierSubmit : onOtpSubmit,
              )}
              className="mt-10 flex flex-col gap-8"
            >
              {step === "identifier" ? (
                <FloatingLabelInput
                  id="identifier"
                  label="Email or Phone Number"
                  autoComplete="username"
                  register={register("identifier", {
                    required: "Email or phone number is required",
                    validate: (value) => {
                      const normalizedValue = value.trim();
                      const emailRegex = /^\S+@\S+\.\S+$/;
                      const phoneRegex = /^\+?[0-9]{8,15}$/;

                      return (
                        emailRegex.test(normalizedValue) ||
                        phoneRegex.test(normalizedValue) ||
                        "Please enter a valid email or phone number"
                      );
                    },
                  })}
                  watchValue={watch("identifier")}
                  error={errors.identifier?.message}
                  icon={<Mail size={18} />}
                  inputClassName="font-medium text-slate-900"
                  containerClassName="h-[68px] bg-white border-[#1aa4ea] rounded-lg"
                  labelClassName="font-medium text-[#1aa4ea]"
                />
              ) : (
                <FloatingLabelInput
                  id="otp"
                  label="OTP Code"
                  autoComplete="one-time-code"
                  register={register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "OTP must be exactly 4 digits",
                    },
                  })}
                  watchValue={watch("otp")}
                  error={errors.otp?.message}
                  inputClassName="font-medium text-slate-900 tracking-[0.4em]"
                  containerClassName="h-[68px] bg-white border-[#1aa4ea] rounded-lg"
                  labelClassName="font-medium text-[#1aa4ea]"
                />
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
                  Change email/phone number
                </button>
              ) : null}

              <Button
                type="submit"
                disabled={isLoading || isVerifyingOtp}
                className="w-full max-w-64 mx-auto h-12 rounded-md  "
              >
                {step === "identifier"
                  ? isLoading
                    ? "SENDING OTP..."
                    : "SEND OTP"
                  : isVerifyingOtp
                    ? "VERIFYING..."
                    : "VERIFY OTP"}
              </Button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-base font-medium text-gray-500">OR</span>
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
                    alt="login"
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
