"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useCreateSupportTicketMutation } from "@/redux/features/tickets/ticketsApi";
import {
  SUPPORT_TICKET_REASONS,
  type SupportTicketReason,
} from "@/constants/supportTickets";
import type { SupportTicketBookingType } from "@/types/supportTicketTypes";
import { getSupportTicketBookingRef, toSupportTicketBooking } from "@/utils/supportTicketBooking";

interface SupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingType: SupportTicketBookingType;
  booking: object;
  confirmationLabel?: string;
}

export default function SupportTicketDialog({
  open,
  onOpenChange,
  bookingType,
  booking,
  confirmationLabel,
}: SupportTicketDialogProps) {
  const t = useTranslations("MyBooking.support");
  const [reason, setReason] = useState<SupportTicketReason | null>(null);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [createTicket, { isLoading }] = useCreateSupportTicketMutation();

  const bookingRef = getSupportTicketBookingRef(
    bookingType,
    toSupportTicketBooking(booking),
  );

  useEffect(() => {
    if (!open) {
      setReason(null);
      setDescription("");
      setSubmitted(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!bookingRef || !reason || !description.trim()) return;

    try {
      await createTicket({
        booking_type: bookingRef.bookingType,
        booking_id: bookingRef.bookingId,
        reason,
        description: description.trim(),
      }).unwrap();
      setSubmitted(true);
    } catch {
      // Errors are surfaced by the API interceptor toast.
    }
  };

  const isSubmitDisabled =
    !bookingRef || !reason || !description.trim() || isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-lg gap-0 p-0 sm:max-w-lg"
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <DialogHeader className="border-b border-gray-200 px-5 py-4 text-start">
          <DialogTitle className="text-start">{t("title")}</DialogTitle>
          {confirmationLabel ? (
            <p className="text-14 text-gray-500">{confirmationLabel}</p>
          ) : null}
        </DialogHeader>

        {submitted ? (
          <div className="px-5 py-6">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5">
              <div className="flex flex-col items-center gap-4 text-center">
                <CheckCircle2
                  className="h-12 w-12 shrink-0 text-emerald-600"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <div className="space-y-2">
                  <h3 className="text-16 font-bold text-slate-900">
                    {t("successTitle")}
                  </h3>
                  <p className="text-14 leading-relaxed text-slate-600">
                    {t("successMessage")}
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 gap-2 sm:justify-center">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => onOpenChange(false)}
              >
                {t("close")}
              </Button>
              <Button type="button" asChild size="lg">
                <Link
                  href="/my-booking/tickets"
                  onClick={(event) => event.stopPropagation()}
                >
                  {t("viewTickets")}
                </Link>
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-5 px-5 py-6">
            <div className="space-y-3">
              <Label className="text-14 font-semibold text-gray-900">
                {t("reasonLabel")}
              </Label>
              <div className="grid gap-2">
                {SUPPORT_TICKET_REASONS.map((value) => {
                  const isSelected = reason === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setReason(value)}
                      className={`flex items-center gap-3 rounded-md border px-4 py-3 text-start text-14 transition-colors ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-gray-200 text-gray-700 hover:border-primary/40 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                          isSelected ? "border-primary" : "border-gray-400"
                        }`}
                      >
                        {isSelected ? (
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        ) : null}
                      </span>
                      <span className="font-medium">
                        {t(`reasons.${value}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="support-description"
                className="text-14 font-semibold text-gray-900"
              >
                {t("descriptionLabel")}
              </Label>
              <textarea
                id="support-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                placeholder={t("descriptionPlaceholder")}
                className="w-full resize-none rounded-md border border-gray-200 bg-white px-3 py-2 text-14 text-gray-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {!bookingRef ? (
              <p className="text-13 text-red-600">{t("missingBookingRef")}</p>
            ) : null}

            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                {t("cancel")}
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
              >
                {isLoading ? t("submitting") : t("submit")}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
