"use client";

import LicenseResultLayout from "@/components/pages/licenses/LicenseBookingPage/LicenseResultLayout";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { LICENSE_BOOKING_OUTCOME_KEY } from "@/constants";
import { useBookingOutcomeFromUrl } from "@/hooks/useBookingOutcomeFromUrl";

export default function Page() {
  const outcome = useBookingOutcomeFromUrl(LICENSE_BOOKING_OUTCOME_KEY);

  return (
    <div>
      <NewNavbar isBgWhite />
      <LicenseResultLayout outcome={outcome} />
    </div>
  );
}
