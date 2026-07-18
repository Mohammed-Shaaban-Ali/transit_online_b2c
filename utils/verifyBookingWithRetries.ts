const VERIFY_ATTEMPTS = 3;
const VERIFY_RETRY_DELAY_MS = 2000;

export async function verifyBookingWithRetries(
  bookingReference: string,
  fetchBooking: (reference: string) => Promise<unknown>,
): Promise<boolean> {
  for (let attempt = 0; attempt < VERIFY_ATTEMPTS; attempt++) {
    try {
      await fetchBooking(bookingReference);
      return true;
    } catch {
      if (attempt < VERIFY_ATTEMPTS - 1) {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, VERIFY_RETRY_DELAY_MS);
        });
      }
    }
  }

  return false;
}
