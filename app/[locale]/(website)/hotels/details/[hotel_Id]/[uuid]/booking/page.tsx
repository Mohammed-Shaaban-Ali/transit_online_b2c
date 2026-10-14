import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import HotelBookingPage from "@/components/pages/hotel/HotelBookingPage";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { readHotelSeoFromSearchParams } from "@/utils/hotels/hotelSeoQuery";
import { buildHotelBookingMetadata } from "@/utils/seo";

type PageProps = {
  params: Promise<{ locale?: string; hotel_Id: string; uuid: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { hotel_Id, uuid, locale: localeParam } = await params;
  const locale = localeParam || (await getLocale());
  const resolvedSearch = await searchParams;
  const seoFields = readHotelSeoFromSearchParams(resolvedSearch);

  return buildHotelBookingMetadata({
    locale,
    hotelId: hotel_Id,
    path: `/hotels/details/${hotel_Id}/${uuid}/booking`,
    seoFields,
  });
}

export default async function page() {
  return (
    <div className="">
      <NewNavbar />
      <HotelBookingPage />
    </div>
  );
}
