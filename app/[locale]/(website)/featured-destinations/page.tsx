"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import { useGetFeaturedDestinationsQuery } from "@/redux/features/website/websiteApi";
import { IFeaturedDestination } from "@/types/website";
import {
  FeaturedDestinationCard,
  FeaturedDestinationCardSkeleton,
} from "@/components/pages/new/home/FeaturedDestinations";

function FeaturedDestinationsPage() {
  const t = useTranslations("NewPage.home.round");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<IFeaturedDestination[]>([]);
  const [isAppending, setIsAppending] = useState(false);
  const { data, isLoading, isFetching } = useGetFeaturedDestinationsQuery({
    page: page || 1,
  });
  const meta = data?.meta;

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    if (page === 1) {
      setItems(data.data);
      return;
    }

    setItems((prev) => {
      const existingIds = new Set(prev.map((item) => item.id));
      const nextItems = data.data.filter((item) => !existingIds.has(item.id));
      return [...prev, ...nextItems];
    });
    setIsAppending(false);
  }, [data, page]);

  const hasMore = Boolean(meta && meta.current_page < meta.last_page);
  const loading = isLoading && page === 1;
  const loadingMore = isAppending && isFetching;

  const handleLoadMore = () => {
    if (!meta || loadingMore || !hasMore || isFetching) {
      return;
    }

    setIsAppending(true);
    setPage((prev) => prev + 1);
  };

  return (
    <>
      <NewNavbar isBgWhite />
      <section className="container mx-auto w-full max-w-[1200px]! px-3 pb-8 pt-28 md:pt-24">
        <h1 className="mb-5 text-[24px] font-bold leading-tight">
          {isRtl ? "واجهات مميزه" : "Featured Destinations"}
        </h1>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <FeaturedDestinationCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((post) => (
                <FeaturedDestinationCard post={post} key={post.id} />
              ))}
            </div>

            {hasMore ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isFetching}
                  className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isFetching ? t("loading") : t("loadMore")}
                </button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </>
  );
}

export default FeaturedDestinationsPage;
