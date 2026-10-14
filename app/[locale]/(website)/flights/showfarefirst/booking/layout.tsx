import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata("flightBooking");

export default function FlightBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
