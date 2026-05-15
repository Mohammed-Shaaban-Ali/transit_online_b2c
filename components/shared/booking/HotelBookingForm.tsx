"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FaChild } from "react-icons/fa";
import PhoneInput from "@/components/shared/form/PhoneInput";
import HotelMemberRewardsAndSpecialRequests from "./HotelMemberRewardsAndSpecialRequests";
import HotelBookingTrustFooter from "./HotelBookingTrustFooter";

export interface GuestData {
  firstName: string;
  lastName: string;
  type: "adult" | "child";
}

export interface BookingFormValues {
  email: string;
  phone: string;
  phoneCountryCode: string;
  guests: GuestData[];
}

interface RoomGuestDistribution {
  roomIndex: number;
  roomName: string;
  adults: number;
  children: number;
  guestStartIndex: number;
}

/** Passed from hotel booking page to render rewards + special requests above submit. */
export interface HotelMemberRewardsFormContext {
  checkIn: string;
  refundableText?: string;
  showFreeCancellation: boolean;
}

interface HotelBookingFormProps {
  adults: number;
  children: number;
  rooms: any[];
  isSubmitting?: boolean;
  onSubmit: (data: BookingFormValues) => void;
  memberRewards?: HotelMemberRewardsFormContext;
}

export default function HotelBookingForm({
  adults,
  children: childrenCount,
  rooms,
  isSubmitting = false,
  onSubmit,
  memberRewards,
}: HotelBookingFormProps) {
  const t = useTranslations("BookingForm");

  const numRooms = rooms?.length || 1;
  const roomDistribution: RoomGuestDistribution[] = [];

  let guestIndex = 0;
  for (let i = 0; i < numRooms; i++) {
    const adultsInRoom =
      Math.floor(adults / numRooms) + (i < adults % numRooms ? 1 : 0);
    const childrenInRoom =
      Math.floor(childrenCount / numRooms) +
      (i < childrenCount % numRooms ? 1 : 0);

    roomDistribution.push({
      roomIndex: i,
      roomName: rooms?.[i]?.roomName || `${t("room")} ${i + 1}`,
      adults: adultsInRoom,
      children: childrenInRoom,
      guestStartIndex: guestIndex,
    });

    guestIndex += adultsInRoom + childrenInRoom;
  }

  const defaultGuests: GuestData[] = [];
  for (const room of roomDistribution) {
    for (let a = 0; a < room.adults; a++) {
      defaultGuests.push({ firstName: "", lastName: "", type: "adult" });
    }
    for (let c = 0; c < room.children; c++) {
      defaultGuests.push({ firstName: "", lastName: "", type: "child" });
    }
  }

  const bookingSchema = z.object({
    email: z
      .string()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    phone: z.string().min(8, t("validation.phoneInvalid")),
    phoneCountryCode: z.string().min(1),
    guests: z.array(
      z.object({
        firstName: z
          .string()
          .min(1, t("validation.firstNameRequired"))
          .regex(/^[a-zA-Z ]+$/, t("validation.englishLettersOnly")),
        lastName: z
          .string()
          .min(1, t("validation.lastNameRequired"))
          .regex(/^[a-zA-Z ]+$/, t("validation.englishLettersOnly")),
        type: z.enum(["adult", "child"]),
      }),
    ),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      email: "",
      phone: "",
      phoneCountryCode: "20",
      guests: defaultGuests,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* ===== Who's staying? Section ===== */}
      <div className="bg-white">
        <div className="mb-4">
          <h2 className="text-24 font-bold text-slate-900 mb-1">
            {t("whosStaying")}
          </h2>
          <p className="text-14 text-gray-600">{t("guestNamesMatchValidID")}</p>
        </div>

        <div className="flex flex-col gap-6">
          {roomDistribution.map((room) => {
            const roomGuests: {
              guestIndex: number;
              type: "adult" | "child";
              localIdx: number;
            }[] = [];
            let idx = room.guestStartIndex;
            let localIdx = 1;
            for (let a = 0; a < room.adults; a++) {
              roomGuests.push({ guestIndex: idx++, type: "adult", localIdx: localIdx++ });
            }
            for (let c = 0; c < room.children; c++) {
              roomGuests.push({ guestIndex: idx++, type: "child", localIdx: localIdx++ });
            }

            return (
              <div key={room.roomIndex} className="flex flex-col gap-5">
                {numRooms > 1 && (
                  <h4 className="text-16 font-bold text-primary">
                    {t("room")} {room.roomIndex + 1}
                  </h4>
                )}

                {roomGuests.map((guest) => (
                  <div key={guest.guestIndex} className="flex flex-col gap-3">
                    {(adults + childrenCount > 1 || guest.type === "child") && (
                      <div className="flex items-center gap-2">
                        {guest.type === "child" && (
                          <FaChild size={12} className="text-orange-500" />
                        )}
                        <span className="text-13 font-bold text-gray-600">
                          {guest.type === "adult" ? t("adult") : t("child")}{" "}
                          {guest.localIdx}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FloatingLabelInput
                        id={`guests.${guest.guestIndex}.firstName`}
                        label={t("firstName")}
                        register={register(`guests.${guest.guestIndex}.firstName`)}
                        watchValue={watch(`guests.${guest.guestIndex}.firstName`)}
                        error={errors.guests?.[guest.guestIndex]?.firstName?.message}
                        inputClassName="font-medium text-slate-900 placeholder:font-normal placeholder:text-gray-400"
                        containerClassName="h-[68px] bg-white border-gray-300 rounded-lg"
                        labelClassName="font-medium text-slate-500"
                      />
                      <FloatingLabelInput
                        id={`guests.${guest.guestIndex}.lastName`}
                        label={t("lastName")}
                        register={register(`guests.${guest.guestIndex}.lastName`)}
                        watchValue={watch(`guests.${guest.guestIndex}.lastName`)}
                        error={errors.guests?.[guest.guestIndex]?.lastName?.message}
                        inputClassName="font-medium text-slate-900 placeholder:font-normal placeholder:text-gray-400"
                        containerClassName="h-[68px] bg-white border-gray-300 rounded-lg"
                        labelClassName="font-medium text-slate-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}

          {/* ===== Email + Phone Row ===== */}
          <div>
            <h4 className="text-16 font-bold mb-2">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <FloatingLabelInput
                  id="email"
                  label={t("email")}
                  type="email"
                  register={register("email")}
                  watchValue={watch("email")}
                  error={errors.email?.message}
                  inputClassName="font-medium text-slate-900"
                  containerClassName="h-[68px] bg-white border-gray-300 rounded-lg"
                  labelClassName="font-medium text-slate-500"
                />
                {!errors.email && (
                  <p className="text-13 text-gray-600 mt-1.5 ms-1">
                    {t("bookingConfirmationSent")}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <PhoneInput
                  value={watch("phone")}
                  label={t("phoneNumber")}
                  error={errors.phone?.message}
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
        </div>
      </div>

      {memberRewards ? (
        <HotelMemberRewardsAndSpecialRequests
          checkIn={memberRewards.checkIn}
          refundableText={memberRewards.refundableText}
          showFreeCancellation={memberRewards.showFreeCancellation}
        />
      ) : null}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 text-16 font-bold text-white"
      >
        {isSubmitting ? t("submitting") : t("bookNow")}
      </Button>

      <HotelBookingTrustFooter />
    </form>
  );
}
