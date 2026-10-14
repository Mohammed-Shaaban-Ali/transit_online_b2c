import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import FeaturedDestinationDetailsClient from "@/components/pages/featured-destinations/FeaturedDestinationDetailsClient";
import {
  buildPageMetadata,
  fetchFeaturedDestinationServer,
} from "@/utils/seo";

type PageProps = {
  params: Promise<{ locale?: string; id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale: localeParam } = await params;
  const locale = localeParam || (await getLocale());
  const destination = await fetchFeaturedDestinationServer(id);

  const keywords = destination?.seo_keywords
    ? destination.seo_keywords
        .split(/[,،]/)
        .map((k) => k.trim())
        .filter(Boolean)
    : undefined;

  return buildPageMetadata({
    locale,
    page: "featuredDestinationDetails",
    path: `/featured-destinations/${id}`,
    title: destination?.seo_title || destination?.title,
    description:
      destination?.short_description ||
      destination?.description ||
      undefined,
    keywords,
    image: destination?.seo_image || destination?.featured_image,
  });
}

export default function FeaturedDestinationDetailsPage() {
  return <FeaturedDestinationDetailsClient />;
}
