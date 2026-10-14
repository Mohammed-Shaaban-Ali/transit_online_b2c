import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata("myBooking");

export default function MyBookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
