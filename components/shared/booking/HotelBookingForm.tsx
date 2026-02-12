"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FloatingLabelInput from "@/components/shared/form/FloatingLabelInput";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FaUser, FaChild } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

// Types
export interface GuestData {
  title: "mr" | "mrs" | "ms";
  firstName: string;
  lastName: string;
  type: "adult" | "child";
}

export interface BookingFormValues {
  email: string;
  phone: string;
  guests: GuestData[];
}

interface RoomGuestDistribution {
  roomIndex: number;
  roomName: string;
  adults: number;
  children: number;
  guestStartIndex: number;
}

interface HotelBookingFormProps {
  adults: number;
  children: number;
  rooms: any[];
  isSubmitting?: boolean;
  onSubmit: (data: BookingFormValues) => void;
}

// Title Selector Component
function TitleSelector({
  value,
  onChange,
  t,
}: {
  value: "mr" | "mrs" | "ms";
  onChange: (val: "mr" | "mrs" | "ms") => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const titles: { value: "mr" | "mrs" | "ms"; label: string }[] = [
    { value: "mr", label: t("mr") },
    { value: "mrs", label: t("mrs") },
    { value: "ms", label: t("ms") },
  ];

  return (
    <div className="flex gap-2">
      {titles.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`flex-1 py-2.5 px-3 rounded-lg text-14 font-bold border-2 transition-all duration-200 cursor-pointer ${value === item.value
            ? "bg-primary text-white border-primary"
            : "bg-white text-gray-600 border-gray-200 hover:border-primary/50"
            }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export default function HotelBookingForm({
  adults,
  children: childrenCount,
  rooms,
  isSubmitting = false,
  onSubmit,
}: HotelBookingFormProps) {
  const t = useTranslations("BookingForm");

  // Calculate guest distribution per room
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

  const totalGuests = adults + childrenCount;

  // Build default guests array
  const defaultGuests: GuestData[] = [];
  for (const room of roomDistribution) {
    for (let a = 0; a < room.adults; a++) {
      defaultGuests.push({
        title: "mr",
        firstName: "",
        lastName: "",
        type: "adult",
      });
    }
    for (let c = 0; c < room.children; c++) {
      defaultGuests.push({
        title: "mr",
        firstName: "",
        lastName: "",
        type: "child",
      });
    }
  }

  // Zod schema
  const bookingSchema = z.object({
    email: z.string().min(1, t("validation.emailRequired")).email(t("validation.emailInvalid")),
    phone: z.string().min(5, t("validation.phoneRequired")),
    guests: z.array(
      z.object({
        title: z.enum(["mr", "mrs", "ms"]),
        firstName: z.string().min(1, t("validation.firstNameRequired")),
        lastName: z.string().min(1, t("validation.lastNameRequired")),
        type: z.enum(["adult", "child"]),
      })
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
      guests: defaultGuests,
    },
  });

  const watchEmail = watch("email");
  const watchPhone = watch("phone");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Contact Information Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
          <MdEmail size={18} className="text-primary" />
          <h3 className="text-16 font-bold">{t("contactInfo")}</h3>
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-5">
          {/* Email */}
          <FloatingLabelInput
            id="email"
            label={t("email")}
            type="email"
            register={register("email")}
            watchValue={watchEmail}
            error={errors.email?.message}
            icon={<MdEmail size={16} />}
          />

          {/* Phone */}
          <FloatingLabelInput
            id="phone"
            label={t("phoneNumber")}
            type="tel"
            register={register("phone")}
            watchValue={watchPhone}
            error={errors.phone?.message}
            icon={<MdPhone size={16} />}
          />
        </div>
      </div>

      {/* Guest Information Section */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
          <FaUser size={16} className="text-primary" />
          <h3 className="text-16 font-bold">{t("guestInfo")}</h3>
        </div>

        <div className="p-4 md:p-5 flex flex-col gap-6">
          {roomDistribution.map((room) => {
            const roomGuests: { guestIndex: number; type: "adult" | "child" }[] = [];
            let idx = room.guestStartIndex;
            for (let a = 0; a < room.adults; a++) {
              roomGuests.push({ guestIndex: idx++, type: "adult" });
            }
            for (let c = 0; c < room.children; c++) {
              roomGuests.push({ guestIndex: idx++, type: "child" });
            }

            return (
              <div key={room.roomIndex} className="flex flex-col gap-4">
                {/* Room Header */}
                {numRooms > 1 && (
                  <h4 className="text-16 font-bold text-primary text-center">
                    {t("room")} {room.roomIndex + 1}
                  </h4>
                )}

                {roomGuests.map((guest, gIdx) => {
                  const guestTitle = watch(`guests.${guest.guestIndex}.title`);

                  return (
                    <div
                      key={guest.guestIndex}
                      className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3"
                    >
                      {/* Guest type badge */}
                      <div className="flex items-center gap-2 mb-1">
                        {guest.type === "adult" ? (
                          <FaUser size={12} className="text-primary" />
                        ) : (
                          <FaChild size={12} className="text-orange-500" />
                        )}
                        <span className="text-13 font-bold text-gray-600">
                          {guest.type === "adult"
                            ? t("adult")
                            : t("child")}{" "}
                          {gIdx + 1}
                        </span>
                      </div>

                      {/* Title Selector */}
                      <TitleSelector
                        value={guestTitle || "mr"}
                        onChange={(val) =>
                          setValue(`guests.${guest.guestIndex}.title`, val)
                        }
                        t={t}
                      />

                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-3">
                        <FloatingLabelInput
                          id={`guests.${guest.guestIndex}.firstName`}
                          label={t("firstName")}
                          register={register(
                            `guests.${guest.guestIndex}.firstName`
                          )}
                          watchValue={watch(
                            `guests.${guest.guestIndex}.firstName`
                          )}
                          error={
                            errors.guests?.[guest.guestIndex]?.firstName
                              ?.message
                          }
                        />
                        <FloatingLabelInput
                          id={`guests.${guest.guestIndex}.lastName`}
                          label={t("lastName")}
                          register={register(
                            `guests.${guest.guestIndex}.lastName`
                          )}
                          watchValue={watch(
                            `guests.${guest.guestIndex}.lastName`
                          )}
                          error={
                            errors.guests?.[guest.guestIndex]?.lastName?.message
                          }
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 rounded-xl text-16 font-bold text-white"
      >
        {isSubmitting ? t("submitting") : t("bookNow")}
      </Button>
    </form>
  );
}
