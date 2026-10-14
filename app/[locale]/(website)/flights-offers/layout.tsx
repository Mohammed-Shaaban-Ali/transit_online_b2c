import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata("flightsOffers");

export default function FlightsOffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
