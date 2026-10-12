import { redirect } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Booking form lives on /cruises as an in-flow step; keep result redirect route only. */
export default async function CruiseBookingRoutePage({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/cruises", locale });
}
