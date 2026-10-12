"use client";

import { useState } from "react";
import { Headphones } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAppSelector } from "@/redux/app/hooks";
import type { SupportTicketBookingType } from "@/types/supportTicketTypes";
import { getBookingConfirmationNumber } from "@/utils/getBookingConfirmationNumber";
import SupportTicketDialog from "./SupportTicketDialog";

interface SupportButtonProps {
  bookingType: SupportTicketBookingType;
  booking: object;
}

export default function SupportButton({
  bookingType,
  booking,
}: SupportButtonProps) {
  const t = useTranslations("MyBooking.support");
  const user = useAppSelector((state) => state.auth.user);
  const isCompanyAccount = Boolean(user?.is_company_b2b_account);
  const [open, setOpen] = useState(false);

  if (!isCompanyAccount) return null;

  const confirmationNumber = getBookingConfirmationNumber(booking);

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen(true);
        }}
        onPointerDown={(event) => event.stopPropagation()}
        className="inline-flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-13 font-semibold text-gray-700 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
      >
        <Headphones className="h-3.5 w-3.5" />
        {t("button")}
      </button>

      <SupportTicketDialog
        open={open}
        onOpenChange={setOpen}
        bookingType={bookingType}
        booking={booking}
        confirmationLabel={
          confirmationNumber
            ? `${t("bookingRef")}: ${confirmationNumber}`
            : undefined
        }
      />
    </>
  );
}
