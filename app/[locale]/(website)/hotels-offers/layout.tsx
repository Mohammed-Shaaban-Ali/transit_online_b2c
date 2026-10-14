import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata("hotelsOffers");

export default function HotelsOffersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
