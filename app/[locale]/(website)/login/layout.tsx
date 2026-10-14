import { createPageGenerateMetadata } from "@/utils/seo";

export const generateMetadata = createPageGenerateMetadata("login");

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
