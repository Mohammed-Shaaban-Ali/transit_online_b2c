import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata("cruiseBooking");

export default function CruiseBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
