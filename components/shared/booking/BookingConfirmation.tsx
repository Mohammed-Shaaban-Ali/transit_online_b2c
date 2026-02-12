"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";
import {
  FaCheckCircle,
  FaCalendar,
  FaClock,
  FaUser,
  FaChild,
  FaEnvelope,
  FaPhone,
  FaHotel,
  FaUtensils,
} from "react-icons/fa";
import { IoMdBed } from "react-icons/io";
import { MdMeetingRoom } from "react-icons/md";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import StarRating from "@/components/shared/StarRating";
import { formatePrice } from "@/utils/formatePrice";
import type { BookingFormValues, GuestData } from "./HotelBookingForm";

interface BookingConfirmationProps {
  bookingId: string;
  hotelName: string;
  hotelImage?: string;
  starRating: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  childrenCount: number;
  totalPrice: number;
  formData: BookingFormValues;
  rooms: any[];
}

// Reusable animated wrapper
function AnimatedCard({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`opacity-0 ${className}`}
      style={{
        animation: `fadeInUp 0.6s ease-out ${delay}s forwards`,
      }}
    >
      {children}
    </div>
  );
}

export default function BookingConfirmation({
  bookingId,
  hotelName,
  hotelImage,
  starRating,
  checkIn,
  checkOut,
  nights,
  adults,
  childrenCount,
  totalPrice,
  formData,
  rooms,
}: BookingConfirmationProps) {
  const t = useTranslations("BookingConfirmation");
  const tForm = useTranslations("BookingForm");
  const tHotelsCard = useTranslations("HotelsCard");
  const router = useRouter();

  const getTitleLabel = (title: string) => {
    switch (title) {
      case "mr":
        return tForm("mr");
      case "mrs":
        return tForm("mrs");
      case "ms":
        return tForm("ms");
      default:
        return "";
    }
  };

  return (
    <>
      {/* Keyframes */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes checkBounce {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      <div className="container my-24">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {/* ===== Success Header ===== */}
          <AnimatedCard delay={0}>
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 text-center">
              <div
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 opacity-0"
                style={{
                  animation: "checkBounce 0.7s ease-out 0.3s forwards",
                }}
              >
                <FaCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h1 className="text-24 md:text-28 font-bold mb-2">
                {t("title")}
              </h1>
              <p className="text-gray-500 mb-4">{t("description")}</p>

              {/* Booking ID */}
              <div
                className="inline-flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 opacity-0"
                style={{
                  animation: "scaleIn 0.4s ease-out 0.6s forwards",
                }}
              >
                <span className="text-14 text-gray-500">
                  {t("bookingId")}:
                </span>
                <span className="text-18 font-bold text-primary font-mono tracking-wider">
                  {bookingId}
                </span>
              </div>
            </div>
          </AnimatedCard>

          {/* ===== Hotel Details Card ===== */}
          <AnimatedCard delay={0.15}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Hotel Image */}
                {hotelImage && (
                  <div className="relative w-full sm:w-[200px] h-[180px] sm:h-auto shrink-0 overflow-hidden">
                    <Image
                      fill
                      className="object-cover"
                      src={hotelImage}
                      alt={hotelName}
                    />
                  </div>
                )}

                {/* Hotel Info */}
                <div className="flex-1 p-4 md:p-5 flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-18 font-bold">{hotelName}</h2>
                    <StarRating rating={starRating} />
                  </div>

                  {/* Quick Info */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium">
                      <FaCalendar size={12} />
                      <span>
                        {checkIn} - {checkOut}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium">
                      <FaClock size={12} />
                      <span>
                        {nights}{" "}
                        {nights === 1
                          ? tHotelsCard("night")
                          : tHotelsCard("nights")}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium">
                      <FaUser size={12} />
                      <span>
                        {adults}{" "}
                        {adults === 1
                          ? tHotelsCard("adult")
                          : tHotelsCard("adults")}
                        {childrenCount > 0 &&
                          `, ${childrenCount} ${childrenCount === 1 ? tHotelsCard("child") : tHotelsCard("children")}`}
                      </span>
                    </div>
                  </div>

                  {/* Room Details */}
                  {rooms?.length > 0 && (
                    <div className="flex flex-col gap-2 mt-1">
                      {rooms.map((room: any, idx: number) => (
                        <div
                          key={room.id || idx}
                          className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                        >
                          <MdMeetingRoom
                            size={14}
                            className="text-primary shrink-0"
                          />
                          <span className="text-13 font-medium">
                            {room.roomName}
                          </span>
                          {room.roomType && (
                            <>
                              <span className="text-gray-300">|</span>
                              <IoMdBed size={14} className="text-gray-400" />
                              <span className="text-12 text-gray-500">
                                {room.roomType}
                              </span>
                            </>
                          )}
                          {room.roomBasis && (
                            <>
                              <span className="text-gray-300">|</span>
                              <FaUtensils
                                size={10}
                                className="text-gray-400"
                              />
                              <span className="text-12 text-gray-500">
                                {room.roomBasis}
                              </span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Total Price */}
                  <div className="bg-primary/5 rounded-xl p-3 flex items-center justify-between mt-1">
                    <span className="text-14 font-bold">{t("totalPrice")}</span>
                    <div className="flex items-center gap-1 rtl:flex-row-reverse">
                      <CurrencySymbol size="md" />
                      <span className="text-22 font-bold text-primary">
                        {formatePrice(totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* ===== Contact Info Summary ===== */}
          <AnimatedCard delay={0.3}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
                <FaEnvelope size={14} className="text-primary" />
                <h3 className="text-16 font-bold">{t("contactInfo")}</h3>
              </div>
              <div className="p-4 md:p-5 flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FaEnvelope size={14} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-11 text-gray-400">{tForm("email")}</div>
                    <div className="text-14 font-medium">{formData.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-1 bg-gray-50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FaPhone size={14} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-11 text-gray-400">{tForm("phone")}</div>
                    <div className="text-14 font-medium" dir="ltr">
                      +966 {formData.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* ===== Guests Summary ===== */}
          <AnimatedCard delay={0.45}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
                <FaUser size={14} className="text-primary" />
                <h3 className="text-16 font-bold">{t("guests")}</h3>
              </div>
              <div className="p-4 md:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {formData.guests.map((guest: GuestData, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${guest.type === "adult"
                            ? "bg-primary/10"
                            : "bg-orange-100"
                          }`}
                      >
                        {guest.type === "adult" ? (
                          <FaUser size={12} className="text-primary" />
                        ) : (
                          <FaChild size={12} className="text-orange-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-14 font-bold truncate">
                          {getTitleLabel(guest.title)} {guest.firstName}{" "}
                          {guest.lastName}
                        </div>
                        <div className="text-12 text-gray-400">
                          {guest.type === "adult"
                            ? tForm("adult")
                            : tForm("child")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedCard>


        </div>
      </div>
    </>
  );
}
