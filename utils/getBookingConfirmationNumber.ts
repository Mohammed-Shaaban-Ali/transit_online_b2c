type ConfirmationSource = {
  confirmation_number?: string | null;
  confirmationNumber?: string | null;
  booking_number?: string | null;
  reference?: string | null;
  reservationId?: string | null;
  id?: string | number | null;
  booking?: { confirmationNumber?: string | null };
  bookingData?: { confirmationNumber?: string | null };
  booking_data?: {
    confirmation_number?: string | null;
    reference?: string | null;
    id?: string | number | null;
  };
};

function pickFirstNonEmpty(
  ...values: Array<string | number | null | undefined>
): string {
  for (const value of values) {
    if (value == null) continue;
    const normalized = String(value).trim();
    if (normalized) return normalized;
  }
  return "";
}

export function getBookingConfirmationNumber(
  booking: ConfirmationSource,
  extraFallbacks: Array<string | number | null | undefined> = [],
): string {
  return pickFirstNonEmpty(
    booking.confirmation_number,
    booking.confirmationNumber,
    booking.booking?.confirmationNumber,
    booking.bookingData?.confirmationNumber,
    booking.booking_data?.confirmation_number,
    booking.booking_number,
    booking.reference,
    booking.booking_data?.reference,
    booking.reservationId,
    ...extraFallbacks,
    booking.id,
    booking.booking_data?.id,
  );
}
