"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { FaHotel } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import { getCookie } from "cookies-next";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { HOTEL_BOOKING_KEY, HOTEL_BOOKING_ID_KEY, HOTEL_BOOKING_FORM_DATA_KEY } from "@/constants";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import HotelBookingForm from "@/components/shared/booking/HotelBookingForm";
import type { BookingFormValues } from "@/components/shared/booking/HotelBookingForm";
import HotelDetailsCard from "./HotelDetailsCard";
import DatesCard from "./DatesCard";
import PriceDetailsCard from "./PriceDetailsCard";
import CancellationPolicyCard from "./CancellationPolicyCard";
import RewardsCard from "./RewardsCard";
import FinePrintCard from "./FinePrintCard";
import SavingsBanner from "./SavingsBanner";
import { hotelBookingSuccessPath, hotelBookingFailedPath } from "./hotelBookingPaths";
import {
  useBookHotelMutation,
  useLazyCalculateHotelPriceQuery,
  useLazyGetHotelBookingQuery,
  type HotelPassenger,
} from "@/redux/features/hotels/hotelsApi";
import {
  useLoginMutation,
  useSendOtpMutation,
} from "@/redux/features/auth/authApi";
import { toast } from "sonner";
import type { IPackage } from "@/types/hotels";

interface HotelBookingData {
  hotelId: string;
  uuid: string;
  hotelName: string;
  starRating: number;
  hotelImage?: string;
  package: IPackage;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
}

const HotelBookingPage = () => {
  const t = useTranslations("HotelBooking");
  const router = useRouter();

  const [hotelData, setHotelData] = useState<HotelBookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isLoginRequiredDialogOpen, setIsLoginRequiredDialogOpen] = useState(false);
  const [pendingBookingData, setPendingBookingData] = useState<BookingFormValues | null>(null);
  const [loginPhoneMeta, setLoginPhoneMeta] = useState<string | null>(null);
  const [loginOtpDigits, setLoginOtpDigits] = useState(["", "", "", ""]);
  const [loginError, setLoginError] = useState("");
  const loginOtpRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);
  const isVerifyingPaymentRef = useRef(false);

  const [calculatePrice, calculatePriceState] = useLazyCalculateHotelPriceQuery();
  const [bookHotel] = useBookHotelMutation();
  const [getHotelBooking] = useLazyGetHotelBookingQuery();
  const [login, { isLoading: isSendingLoginOtp }] = useLoginMutation();
  const [sendOtp, { isLoading: isVerifyingLoginOtp }] = useSendOtpMutation();

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(HOTEL_BOOKING_KEY);
      if (stored) {
        setHotelData(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error reading hotel booking data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger loyalty price calculation once hotel data is loaded
  useEffect(() => {
    if (!hotelData) return;
    const originalPrice = Number(hotelData.package?.price?.finalPrice || 0);
    if (!originalPrice) return;

    calculatePrice({ originalPrice, module: "hotels", points: false }).catch(
      (error) => console.error("Hotel price calculation error:", error),
    );
  }, [hotelData, calculatePrice]);

  // Listen for payment completion inside the iframe
  useEffect(() => {
    const onPaymentMessage = (event: MessageEvent) => {
      if (!isPaymentDialogOpen) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      const url = String((data as { url?: string }).url || "").toLowerCase();
      const bookingId = activeBookingId || sessionStorage.getItem(HOTEL_BOOKING_ID_KEY);

      if (!bookingId) {
        console.error("Payment finished but booking id is missing.");
        setIsPaymentDialogOpen(false);
        setIsVerifyingPayment(false);
        if (hotelData) {
          router.replace(hotelBookingFailedPath(hotelData.hotelId, hotelData.uuid));
        } else {
          router.push("/hotels");
        }
        return;
      }

      if (url.includes("gita.sa")) {
        setPaymentRedirectUrl(null);
        void verifyBookingAfterPayment(bookingId);
      }
    };

    window.addEventListener("message", onPaymentMessage);
    return () => window.removeEventListener("message", onPaymentMessage);
  }, [activeBookingId, isPaymentDialogOpen, router, hotelData]);

  const verifyBookingAfterPayment = async (bookingId: string) => {
    if (isVerifyingPaymentRef.current) return;
    isVerifyingPaymentRef.current = true;
    setIsVerifyingPayment(true);

    try {
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          const result = await getHotelBooking(bookingId, false).unwrap();
          if (result?.data) {
            setIsPaymentDialogOpen(false);
            if (hotelData) {
              router.replace(
                hotelBookingSuccessPath(hotelData.hotelId, hotelData.uuid),
              );
            } else {
              router.push("/hotels");
            }
            return;
          }
        } catch (error) {
          console.error(`Hotel booking verification attempt ${attempt} failed:`, error);
        }
        if (attempt < 3) await sleep(3000);
      }
      setIsPaymentDialogOpen(false);
      if (hotelData) {
        router.replace(hotelBookingFailedPath(hotelData.hotelId, hotelData.uuid));
      } else {
        router.push("/hotels");
      }
    } finally {
      isVerifyingPaymentRef.current = false;
      setIsVerifyingPayment(false);
    }
  };

  /** Strip every character that isn't a-z, A-Z or space (backend validation). */
  const sanitizeName = (name: string) =>
    name.replace(/[^a-zA-Z ]/g, "").trim();

  /**
   * Build the passengers array from form guests + package room data.
   *
   * Allocation  = the room's `id` (from IPackageRoom).
   * leadPaxID   = "pax-1" (first passenger).
   * Children    = no email/phone, but get Age from the room's kidsAges array.
   */
  const buildPassengers = (
    data: BookingFormValues,
    pkg: IPackage,
    fullPhone: string,
  ): HotelPassenger[] => {
    const rooms = pkg.rooms || [];
    const numRooms = rooms.length || 1;
    const totalAdults = hotelData?.adults ?? 0;
    const totalChildren = hotelData?.children ?? 0;

    const passengers: HotelPassenger[] = [];
    let guestIndex = 0;

    for (let i = 0; i < numRooms; i++) {
      const room = rooms[i];
      const roomAllocation = room?.id ?? "";
      const adultsInRoom =
        Math.floor(totalAdults / numRooms) + (i < totalAdults % numRooms ? 1 : 0);
      const childrenInRoom =
        Math.floor(totalChildren / numRooms) + (i < totalChildren % numRooms ? 1 : 0);

      // Adults in this room
      for (let a = 0; a < adultsInRoom; a++) {
        const guest = data.guests[guestIndex];
        const paxId = `pax-${guestIndex + 1}`;
        passengers.push({
          Id: paxId,
          Allocation: roomAllocation,
          Email: { Value: data.email.trim() },
          Telephone: { PhoneNumber: fullPhone },
          PersonDetails: {
            Name: {
              GivenName: sanitizeName(guest?.firstName ?? ""),
              Surname: sanitizeName(guest?.lastName ?? ""),
              NamePrefix: "Mr.",
            },
            Type: 0,
          },
        });
        guestIndex++;
      }

      // Children in this room — no email/phone, Age comes from room.kidsAges
      for (let c = 0; c < childrenInRoom; c++) {
        const guest = data.guests[guestIndex];
        const age = room?.kidsAges?.[c] ?? 0;
        const paxId = `pax-${guestIndex + 1}`;
        passengers.push({
          Id: paxId,
          Allocation: roomAllocation,
          PersonDetails: {
            Name: {
              GivenName: sanitizeName(guest?.firstName ?? ""),
              Surname: sanitizeName(guest?.lastName ?? ""),
              NamePrefix: "Mstr.",
            },
            Type: 1,
            Age: age,
          },
        });
        guestIndex++;
      }
    }

    return passengers;
  };

  const submitBookingWithAuth = async (data: BookingFormValues) => {
    if (!hotelData) return;

    const calculatedData = calculatePriceState.data?.data;
    const paymentGateway = calculatedData?.payment_gateways?.[0];

    if (!calculatedData || !paymentGateway) {
      toast.error("Unable to validate latest price. Please try again.");
      return;
    }

    // Build full phone number (country code + local digits)
    const phoneDigits = data.phone.trim().replace(/\D/g, "");
    const countryCodeDigits = data.phoneCountryCode.replace(/\D/g, "");
    const fullPhone = phoneDigits.startsWith(countryCodeDigits)
      ? phoneDigits
      : `${countryCodeDigits}${phoneDigits}`;

    const pkg = hotelData.package;
    const passengers = buildPassengers(data, pkg, fullPhone);
    const leadPax = passengers[0];

    setIsSubmitting(true);
    try {
      const response = await bookHotel({
        paymentGateway,
        uuid: hotelData.uuid,
        hotelID: Number(hotelData.hotelId),
        packageID: pkg.packageId,
        leadPaxID: leadPax?.Id ?? "pax-1",
        leadPaxAllocation: leadPax?.Allocation ?? "",
        passengers,
      }).unwrap();

      setActiveBookingId(String(response.bookingId || ""));
      sessionStorage.setItem(HOTEL_BOOKING_ID_KEY, String(response.bookingId || ""));
      sessionStorage.setItem(HOTEL_BOOKING_FORM_DATA_KEY, JSON.stringify(data));
      sessionStorage.setItem("HOTEL_BOOKING_PRICE_DATA", JSON.stringify(calculatedData));

      if (response.redirectUrl) {
        setPaymentRedirectUrl(response.redirectUrl);
        setIsVerifyingPayment(false);
        setIsPaymentDialogOpen(true);
        return;
      }

      router.replace(
        hotelBookingSuccessPath(hotelData.hotelId, hotelData.uuid),
      );
    } catch (error) {
      console.error("Hotel booking error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookingSubmit = async (data: BookingFormValues) => {
    const authToken = getCookie("auth-token");
    if (!authToken) {
      setIsSubmitting(true);
      const normalizedPhone = data.phone.trim().replace(/[^\d+]/g, "");
      if (!/^\+?\d{8,15}$/.test(normalizedPhone)) {
        toast.error("Please enter a valid phone number.");
        setIsSubmitting(false);
        return;
      }

      const phoneWithCode = normalizedPhone.startsWith("+")
        ? normalizedPhone
        : `+${normalizedPhone}`;

      setPendingBookingData(data);
      setLoginError("");
      setLoginOtpDigits(["", "", "", ""]);
      setLoginPhoneMeta(phoneWithCode);

      try {
        await login({ login: phoneWithCode, type: "PHONE" }).unwrap();
        setIsLoginRequiredDialogOpen(true);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to send OTP.");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    await submitBookingWithAuth(data);
  };

  const handleLoginOtpChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "").slice(0, 1);
    const updatedDigits = [...loginOtpDigits];
    updatedDigits[index] = value;
    setLoginOtpDigits(updatedDigits);
    if (value && index < loginOtpRefs.current.length - 1) {
      loginOtpRefs.current[index + 1]?.focus();
    }
  };

  const handleLoginOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !loginOtpDigits[index] && index > 0) {
      loginOtpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyBookingLoginOtp = async () => {
    if (!loginPhoneMeta) return;
    setLoginError("");

    const otp = loginOtpDigits.join("");
    if (!/^\d{4}$/.test(otp)) {
      setLoginError("Please enter the 4-digit OTP.");
      return;
    }

    try {
      await sendOtp({
        field: loginPhoneMeta.replace("+", ""),
        otp,
        type: "PHONE",
      }).unwrap();

      setIsLoginRequiredDialogOpen(false);

      if (pendingBookingData) {
        const bookingData = pendingBookingData;
        setPendingBookingData(null);
        await submitBookingWithAuth(bookingData);
      }
    } catch (error: any) {
      setLoginError(error?.data?.message || "Invalid OTP, please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container my-24">
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded-lg w-64 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-48 bg-gray-200 rounded-2xl animate-pulse" />
            </div>
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!hotelData) {
    return (
      <div className="container my-24">
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            <FaHotel className="text-gray-300 text-4xl" />
          </div>
          <h2 className="text-24 font-bold mb-2">{t("noHotelData")}</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {t("noHotelDataDescription")}
          </p>
          <Button
            onClick={() => router.push("/hotels")}
            className="rounded-full h-12 px-8"
          >
            {t("backToSearch")}
          </Button>
        </div>
      </div>
    );
  }

  const item = hotelData;
  const pkg = item.package;
  const firstRoom = pkg?.rooms?.[0];

  const finalPrice = Number(pkg?.price?.finalPrice || 0);
  const roomsCount = pkg?.rooms?.length || 1;
  const adultsCount = firstRoom?.adultsCount || item.adults || 1;

  const grandTotal = finalPrice;
  const cancellationFee = grandTotal * 0.25;
  const totalSavings = Number(pkg?.price?.originalPrice || 0) - finalPrice;

  return (
    <div className="container max-w-[1200px]! mx-auto my-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Guest Info Form */}
        <div className="lg:col-span-2">
          <SavingsBanner totalSavings={totalSavings} />

          <HotelBookingForm
            adults={item.adults}
            children={item.children}
            rooms={pkg?.rooms || []}
            isSubmitting={isSubmitting}
            onSubmit={handleBookingSubmit}
            memberRewards={{
              checkIn: item.checkIn,
              refundableText: pkg?.refundableText,
              showFreeCancellation: pkg?.refundability === 1,
            }}
          />
        </div>

        {/* Right: Hotel Summary Cards */}
        <div className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-12">
            <HotelDetailsCard
              hotelName={item.hotelName}
              hotelImage={item.hotelImage}
              starRating={item.starRating}
              firstRoom={firstRoom}
              adultsCount={adultsCount}
              refundability={pkg?.refundability}
              refundableText={pkg?.refundableText}
            />

            <DatesCard
              checkIn={item.checkIn}
              checkOut={item.checkOut}
              nights={item.nights}
              roomsCount={roomsCount}
            />

            <PriceDetailsCard
              roomsCount={roomsCount}
              nights={item.nights}
              calculatedData={calculatePriceState.data?.data}
              isCalculating={calculatePriceState.isFetching}
              fallbackTotal={grandTotal}
            />

            <CancellationPolicyCard
              checkIn={item.checkIn}
              cancellationFee={cancellationFee}
            />

            <RewardsCard grandTotal={calculatePriceState.data?.data?.total?.value ?? grandTotal} />

            <FinePrintCard />
          </div>
        </div>
      </div>

      {/* ===== OTP / Login Dialog ===== */}
      <Dialog
        open={isLoginRequiredDialogOpen}
        onOpenChange={(open) => {
          setIsLoginRequiredDialogOpen(open);
          if (!open) {
            setLoginError("");
            setLoginOtpDigits(["", "", "", ""]);
          }
        }}
      >
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-2xl font-bold text-slate-900">
              Enter OTP
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600">
              Enter the 4-digit OTP sent to your phone to continue booking.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center justify-center gap-3">
              {loginOtpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    loginOtpRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) =>
                    handleLoginOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) => handleLoginOtpKeyDown(index, event)}
                  className="h-12 w-12 rounded-lg border border-[#d7dce3] bg-white text-center text-lg font-semibold text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              ))}
            </div>
            {loginError ? (
              <p className="text-sm font-medium text-red-500">{loginError}</p>
            ) : null}
          </div>

          <DialogFooter className="mt-4 flex-col gap-3 sm:flex-col sm:justify-stretch">
            <Button
              type="button"
              className="h-11 w-full"
              disabled={isSendingLoginOtp || isVerifyingLoginOtp}
              onClick={() => void handleVerifyBookingLoginOtp()}
            >
              {isVerifyingLoginOtp ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-11 w-full"
              onClick={() => setIsLoginRequiredDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== Payment Iframe Dialog ===== */}
      <Dialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          if (open) setIsPaymentDialogOpen(true);
        }}
      >
        <DialogContent
          className="min-w-screen min-h-screen rounded-none border-none p-0 overflow-hidden"
          showCloseButton={false}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          {isVerifyingPayment ? (
            <div className="flex h-full w-full items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-3 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-base font-medium text-gray-700">
                  Verifying your payment, please wait...
                </p>
              </div>
            </div>
          ) : paymentRedirectUrl ? (
            <iframe
              src={paymentRedirectUrl}
              title="Hotel payment"
              className="w-full h-full border-0"
              allow="payment *"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HotelBookingPage;
