import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildPageMetadata } from "@/utils/seo";

type LayoutProps = {
  params: Promise<{ locale?: string; id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string; id: string }>;
}): Promise<Metadata> {
  const { id, locale: localeParam } = await params;
  const locale = localeParam || (await getLocale());

  return buildPageMetadata({
    locale,
    page: "tripDetails",
    path: `/trips/${id}`,
  });
}

export default function TripDetailsLayout({ children }: LayoutProps) {
  return children;
}
