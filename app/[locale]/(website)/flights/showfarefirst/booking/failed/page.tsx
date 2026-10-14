import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { buildFlightBookingMetadata } from "@/utils/seo";
import FailedClient from "./FailedClient";

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
    outcome: "failed",
  });
}

export default function Page() {
  return <FailedClient />;
}
