"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";
import {
  FaCheckCircle,
  FaUser,
  FaChild,
  FaEnvelope,
  FaPhone,
  FaPlane,
  FaPassport,
  FaCalendarAlt,
  FaExchangeAlt,
  FaUsers,
} from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { MdChildFriendly, MdPerson } from "react-icons/md";
import PriceCell from "@/components/shared/PriceCell";
import { FlightRoute } from "@/components/shared/FlightCardUtils/FlightRoute";
import type { FlightDirection } from "@/types/flightTypes";
import type { FlightBookingData } from "@/components/pages/flights/FlightBookingPage";
import type {
  FlightBookingFormValues,
  FlightPassengerData,
} from "./FlightBookingForm";

interface FlightBookingConfirmationProps {
  bookingId: string;
  departureFrom: string;
  departureTo: string;
  departureDate: string | null;
  returnDate: string | null;
  cabinClass: string;
  adults: number;
  children: number;
  infants: number;
  buyPrice: number;
  formData: FlightBookingFormValues;
  // Full flight data for rendering routes
  departureFlightData: FlightDirection;
  returnFlightData?: FlightDirection;
  flightData: FlightBookingData;
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

export default function FlightBookingConfirmation({
  bookingId,
  departureFrom,
  departureTo,
  departureDate,
  returnDate,
  cabinClass,
  adults,
  children: childrenCount,
  infants,
  buyPrice,
  formData,
  departureFlightData,
  returnFlightData,
  flightData,
}: FlightBookingConfirmationProps) {
  const t = useTranslations("FlightBookingConfirmation");
  const tForm = useTranslations("FlightBookingForm");
  const tFlightCard = useTranslations("FlightCard");
  const router = useRouter();

  const getPassengerTypeInfo = (type: string) => {
    switch (type) {
      case "adult":
        return {
          label: tForm("adult"),
          icon: <FaUser size={12} className="text-primary" />,
          bgColor: "bg-primary/10",
        };
      case "child":
        return {
          label: tForm("child"),
          icon: <FaChild size={12} className="text-orange-500" />,
          bgColor: "bg-orange-100",
        };
      case "infant":
        return {
          label: tForm("infant"),
          icon: <MdChildFriendly size={14} className="text-purple-500" />,
          bgColor: "bg-purple-100",
        };
      default:
        return { label: "", icon: null, bgColor: "" };
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

          {/* ===== Full Flight Details Card ===== */}
          <AnimatedCard delay={0.15}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
                <FaPlane size={14} className="text-primary" />
                <h3 className="text-16 font-bold">{t("flightSummary")}</h3>
              </div>

              <div className="p-4 md:p-5 flex flex-col gap-4">


                {/* Info Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {departureDate && (
                    <div className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium">
                      <FaCalendarAlt size={12} />
                      <span>
                        {tFlightCard("departure")}: {departureDate}
                      </span>
                    </div>
                  )}
                  {returnDate && (
                    <div className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium">
                      <FaCalendarAlt size={12} />
                      <span>
                        {tFlightCard("return")}: {returnDate}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium">
                    <FaPlane size={12} />
                    <span>
                      {cabinClass === "BUSINESS"
                        ? tFlightCard("business")
                        : tFlightCard("economy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium">
                    <FaUser size={12} />
                    <span>
                      {adults}{" "}
                      {adults === 1
                        ? tFlightCard("adult")
                        : tFlightCard("adults")}
                    </span>
                  </div>
                  {childrenCount > 0 && (
                    <div className="flex items-center gap-1.5 bg-primary/5 text-primary rounded-lg px-3 py-2 text-13 font-medium">
                      <FaUsers size={12} />
                      <span>
                        {childrenCount}{" "}
                        {childrenCount === 1
                          ? tFlightCard("child")
                          : tFlightCard("children")}
                      </span>
                    </div>
                  )}
                  {infants > 0 && (
                    <div className="flex items-center gap-1.5 bg-purple-50 text-purple-600 rounded-lg px-3 py-2 text-13 font-medium">
                      <MdChildFriendly size={14} />
                      <span>
                        {infants}{" "}
                        {infants === 1
                          ? tFlightCard("infant")
                          : tFlightCard("infants")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Flight Routes - Full Details */}
                <div className="flex flex-col gap-3 rounded-xl p-2.5 border border-primary/30">
                  {/* Departure Flight */}
                  {departureFlightData && (
                    <div className="border border-primary/50 rounded-lg p-2 sm:p-3 bg-primary-light">
                      <FlightRoute
                        flight={departureFlightData}
                        item={flightData}
                        isReturn={false}
                      />
                    </div>
                  )}
                  {/* Return Flight */}
                  {returnFlightData && (
                    <div className="border border-primary/50 rounded-lg p-2 sm:p-3 bg-primary-light">
                      <FlightRoute
                        flight={returnFlightData}
                        item={flightData}
                        isReturn={true}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-3 flex-wrap">

                    <PriceCell price={buyPrice} />
                  </div>

                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* ===== Contact Info ===== */}
          <AnimatedCard delay={0.3}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
                <MdPerson size={16} className="text-primary" />
                <h3 className="text-16 font-bold">{t("contactInfo")}</h3>
              </div>
              <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FaUser size={12} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-11 text-gray-400">
                      {tForm("fullName")}
                    </div>
                    <div className="text-14 font-medium">
                      {formData.fullName}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FaEnvelope size={12} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-11 text-gray-400">
                      {tForm("email")}
                    </div>
                    <div className="text-14 font-medium">{formData.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FaPhone size={12} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-11 text-gray-400">
                      {tForm("phone")}
                    </div>
                    <div className="text-14 font-medium" dir="ltr">
                      +966 {formData.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedCard>

          {/* ===== Passengers Summary ===== */}
          <AnimatedCard delay={0.45}>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="flex items-center gap-2 px-4 md:px-5 py-3 bg-gray-100 border-b border-gray-200">
                <FaUser size={14} className="text-primary" />
                <h3 className="text-16 font-bold">{t("passengers")}</h3>
              </div>
              <div className="p-4 md:p-5 flex flex-col gap-3">
                {formData.passengers.map(
                  (passenger: FlightPassengerData, index: number) => {
                    const typeInfo = getPassengerTypeInfo(passenger.type);
                    return (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col gap-2"
                      >
                        {/* Name + Type */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${typeInfo.bgColor}`}
                          >
                            {typeInfo.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-16 font-bold truncate">
                              {passenger.firstName} {passenger.lastName}
                            </div>
                            <div className="text-12 text-gray-400">
                              {typeInfo.label} &middot;{" "}
                              {passenger.gender === "male"
                                ? tForm("male")
                                : tForm("female")}
                              {passenger.dateOfBirth &&
                                ` · ${passenger.dateOfBirth}`}
                            </div>
                          </div>
                        </div>

                        {/* Passport Details */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 ps-12">
                          {passenger.passportNumber && (
                            <div className="flex items-center gap-1.5 text-13 text-gray-500">
                              <FaPassport
                                size={11}
                                className="text-gray-400"
                              />
                              <span className="text-gray-400">
                                {tForm("passportNumber")}:
                              </span>
                              <span className="font-medium text-gray-600">
                                {passenger.passportNumber}
                              </span>
                            </div>
                          )}
                          {passenger.nationality && (
                            <div className="flex items-center gap-1.5 text-13 text-gray-500">
                              <span className="text-gray-400">
                                {tForm("nationality")}:
                              </span>
                              <span className="font-medium text-gray-600">
                                {passenger.nationality}
                              </span>
                            </div>
                          )}
                          {passenger.passportExpiry && (
                            <div className="flex items-center gap-1.5 text-13 text-gray-500">
                              <FaCalendarAlt
                                size={11}
                                className="text-gray-400"
                              />
                              <span className="text-gray-400">
                                {tForm("passportExpiry")}:
                              </span>
                              <span className="font-medium text-gray-600">
                                {passenger.passportExpiry}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </AnimatedCard>


        </div>
      </div>
    </>
  );
}
