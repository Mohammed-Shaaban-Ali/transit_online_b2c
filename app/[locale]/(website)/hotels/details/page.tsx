import { Suspense } from "react";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import HotelsTestDetailsContent from "@/components/pages/hotels-test/HotelsTestDetailsContent";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { buildHotelSearchMetadata } from "@/utils/seo";

type PageProps = {
  params: Promise<{ locale?: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function DetailsFallback() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="h-10 max-w-md animate-pulse rounded-md bg-muted" />
      <div className="mt-6 h-32 w-full animate-pulse rounded-md bg-muted" />
    </section>
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const resolved = await searchParams;
  const locale = localeParam || (await getLocale());

  const pick = (key: string) => {
    const value = resolved[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return buildHotelSearchMetadata({
    locale,
    searchValue: pick("searchValue"),
    checkIn: pick("checkIn"),
    checkOut: pick("checkOut"),
    path: "/hotels/details",
  });
}

export default function HotelsTestDetailsPage() {
  return (
    <>
      <NewNavbar />
      <Suspense fallback={<DetailsFallback />}>
        <HotelsTestDetailsContent />
      </Suspense>
    </>
  );
}
