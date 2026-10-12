import type { SupportTicketBookingType } from "@/types/supportTicketTypes";

export type SupportTicketBookingRef = {
  bookingType: SupportTicketBookingType;
  bookingId: string;
};

type BookingLike = Record<string, unknown>;

export function toSupportTicketBooking(booking: object): BookingLike {
  return booking as BookingLike;
}

function pickBookingId(
  bookingType: SupportTicketBookingType,
  booking: BookingLike,
): string | null {
  switch (bookingType) {
    case "flight": {
      const bookingNumber = booking.booking_number;
      return bookingNumber != null ? String(bookingNumber).trim() : null;
    }
    case "package-new": {
      const bookingData = booking.booking_data as BookingLike | undefined;
      const id = bookingData?.id ?? booking.id;
      return id != null ? String(id) : null;
    }
    case "hotel":
    case "package-flight":
    case "cruise":
    case "visa":
    case "license": {
      const id = booking.id;
      return id != null ? String(id) : null;
    }
    default:
      return null;
  }
}

export function getSupportTicketBookingRef(
  bookingType: SupportTicketBookingType,
  booking: BookingLike,
): SupportTicketBookingRef | null {
  const bookingId = pickBookingId(bookingType, booking);
  if (!bookingId) return null;

  return {
    bookingType,
    bookingId,
  };
}
