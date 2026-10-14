import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { fetchHotelPackagesServer } from "@/utils/hotels/fetchHotelPackagesServer";
import {
  buildHotelDetailsUuidHref,
  buildHotelOfferSearchParams,
  normalizeHotelDate,
  parseRoomsSearchParam,
} from "@/utils/hotels/hotelOfferDetails";
import {
  appendHotelSeoParams,
  readHotelSeoFromSearchParams,
} from "@/utils/hotels/hotelSeoQuery";
import { buildHotelDetailMetadata } from "@/utils/seo";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { Link } from "@/i18n/navigation";

type PageProps = {
  params: Promise<{ locale?: string; hotel_Id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { hotel_Id, locale: localeParam } = await params;
  const resolvedSearch = await searchParams;
  const locale = localeParam || (await getLocale());
  const seoFields = readHotelSeoFromSearchParams(resolvedSearch);

  return buildHotelDetailMetadata({
    locale,
    hotelId: hotel_Id,
    path: `/hotels/details/${hotel_Id}`,
    seoFields,
  });
}

export default async function HotelDetailsBootstrapPage({
  params,
  searchParams,
}: PageProps) {
  const { hotel_Id } = await params;
  const resolvedSearch = await searchParams;
  const checkIn = Array.isArray(resolvedSearch.checkIn)
    ? resolvedSearch.checkIn[0]
    : resolvedSearch.checkIn;
  const checkOut = Array.isArray(resolvedSearch.checkOut)
    ? resolvedSearch.checkOut[0]
    : resolvedSearch.checkOut;
  const roomsParam = Array.isArray(resolvedSearch.rooms)
    ? resolvedSearch.rooms[0]
    : resolvedSearch.rooms;
  const locale = await getLocale();
  const seoFields = readHotelSeoFromSearchParams(resolvedSearch);

  if (!checkIn || !checkOut) {
    return (
      <div className="bg-[#f9f9f9] min-h-screen">
        <NewNavbar />
        <section className="container mx-auto max-w-lg px-4 py-28 text-center">
          <p className="text-gray-700">
            {locale === "ar"
              ? "تواريخ الوصول والمغادرة مطلوبة."
              : "Check-in and check-out dates are required."}
          </p>
          <Link
            href="/hotels-offers"
            className="mt-4 inline-block text-primary font-semibold hover:underline"
          >
            {locale === "ar" ? "العودة للعروض" : "Back to offers"}
          </Link>
        </section>
      </div>
    );
  }

  const normalizedCheckIn = normalizeHotelDate(checkIn);
  const normalizedCheckOut = normalizeHotelDate(checkOut);
  const rooms = parseRoomsSearchParam(roomsParam);
  const hotelIdNum = Number(hotel_Id);

  if (!Number.isFinite(hotelIdNum)) {
    return (
      <div className="bg-[#f9f9f9] min-h-screen">
        <NewNavbar />
        <section className="container mx-auto max-w-lg px-4 py-28 text-center">
          <p className="text-gray-700">
            {locale === "ar" ? "معرف الفندق غير صالح." : "Invalid hotel ID."}
          </p>
        </section>
      </div>
    );
  }

  const packagesResponse = await fetchHotelPackagesServer({
    checkIn: normalizedCheckIn,
    checkOut: normalizedCheckOut,
    hotelIds: [hotelIdNum],
    rooms,
  });

  const uuid = packagesResponse?.uuid;

  if (!uuid) {
    return (
      <div className="bg-[#f9f9f9] min-h-screen">
        <NewNavbar />
        <section className="container mx-auto max-w-lg px-4 py-28 text-center">
          <p className="text-gray-700">
            {locale === "ar"
              ? "تعذر تحميل بيانات الفندق. حاول مرة أخرى."
              : "Could not load hotel packages. Please try again."}
          </p>
          <Link
            href="/hotels-offers"
            className="mt-4 inline-block text-primary font-semibold hover:underline"
          >
            {locale === "ar" ? "العودة للعروض" : "Back to offers"}
          </Link>
        </section>
      </div>
    );
  }

  const query = appendHotelSeoParams(
    buildHotelOfferSearchParams(normalizedCheckIn, normalizedCheckOut, rooms),
    seoFields,
  );

  redirect({
    href: buildHotelDetailsUuidHref(hotel_Id, uuid, query),
    locale,
  });
}
