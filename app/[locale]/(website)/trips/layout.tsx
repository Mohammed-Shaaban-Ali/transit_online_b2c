import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata("trips");

export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
