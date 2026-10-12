type BookingStatusInput = {
  status?: string;
  booking_status?: string;
  payment_status?: string;
  finished?: boolean;
  payment?: { status?: string };
};

export function normalizeBookingStatus(booking: BookingStatusInput) {
  const status = (
    booking.booking_status ??
    booking.status ??
    ""
  ).toLowerCase();
  const paymentStatus = (
    booking.payment_status ??
    booking.payment?.status ??
    ""
  ).toLowerCase();

  return { status, paymentStatus, finished: Boolean(booking.finished) };
}

export function matchesBookingStatusFilter(
  booking: BookingStatusInput,
  activeStatus: string,
) {
  if (activeStatus === "all") return true;

  const { status, paymentStatus, finished } = normalizeBookingStatus(booking);

  switch (activeStatus) {
    case "upcoming":
      return (
        status === "upcoming" ||
        (!finished &&
          status !== "finished" &&
          status !== "cancelled" &&
          status !== "canceled" &&
          status !== "failed")
      );
    case "awaiting-payment":
      return (
        paymentStatus === "pending" ||
        paymentStatus === "awaiting" ||
        status === "awaiting-payment" ||
        status === "unpaid"
      );
    case "awaiting-review":
      return (
        status === "awaiting-review" ||
        status === "pending" ||
        status === "processing"
      );
    default:
      return true;
  }
}
