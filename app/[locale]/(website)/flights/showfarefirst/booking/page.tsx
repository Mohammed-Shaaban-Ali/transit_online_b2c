import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import FlightBookingPage from "@/components/pages/flights-test/FlightBookingPage";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { buildFlightBookingMetadata } from "@/utils/seo";

type Props = {
  params?: Promise<{ locale?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const localeParam = params ? (await params).locale : undefined;
  const locale = localeParam || (await getLocale());
  const resolvedSearch = (await searchParams) || {};

  return buildFlightBookingMetadata({
    locale,
    searchParams: resolvedSearch,
  });
}

export default async function page() {
  return (
    <section className="relative flex min-h-screen flex-col text-sm md:bg-primary md:text-base">
      <div
        className="md:h-[76px] md:bg-transparent 
      h-[108px] bg-primary "
      >
        <NewNavbar />
      </div>
      <FlightBookingPage />
    </section>
  );
}
