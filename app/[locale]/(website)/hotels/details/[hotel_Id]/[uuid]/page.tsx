import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import SingleHotel from "@/components/pages/hotel/SingleHotel";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { fetchHotelDetailsServer } from "@/utils/hotels/fetchHotelDetailsServer";
import { readHotelSeoFromSearchParams } from "@/utils/hotels/hotelSeoQuery";
import { buildHotelDetailMetadata } from "@/utils/seo";

type PageProps = {
  params: Promise<{ locale?: string; hotel_Id: string; uuid: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { hotel_Id, uuid, locale: localeParam } = await params;
  const resolvedSearch = await searchParams;
  const locale = localeParam || (await getLocale());
  const seoFields = readHotelSeoFromSearchParams(resolvedSearch);
  const details = await fetchHotelDetailsServer(hotel_Id, uuid);

  return buildHotelDetailMetadata({
    locale,
    hotelId: hotel_Id,
    path: `/hotels/details/${hotel_Id}/${uuid}`,
    seoFields,
    details,
  });
}

export default async function Page({ params }: PageProps) {
  const { hotel_Id, uuid } = await params;

  return (
    <div className="bg-[#f9f9f9]">
      <NewNavbar />
      <SingleHotel hotelID={hotel_Id} uuid={uuid} />
    </div>
  );
}
