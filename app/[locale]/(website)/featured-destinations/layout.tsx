import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata(
  "featuredDestinations",
);

export default function FeaturedDestinationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
