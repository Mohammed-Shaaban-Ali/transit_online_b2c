"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { useTranslations } from "next-intl";
import { useGetFeaturedDestinationsQuery } from "@/redux/features/website/websiteApi";
import { IFeaturedDestination } from "@/types/website";

function FeaturedDestinationsPage() {
  const t = useTranslations("NewPage.home.round");
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
          {t("title")}
        </h1>

        {loading ? (
          <div className="flex h-[240px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500">
            {t("loading")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((post) => {
                const imageUrl = `https://gita.sa/storage/${post.featured_image}`;

                return (
                  <article
                    key={post.id}
                    className="overflow-hidden rounded-lg border border-gray-300 bg-white"
                  >
                    <div className="relative h-[190px] overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h2 className="line-clamp-2 text-[17px] font-semibold">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                        {post.short_description || post.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {hasMore ? (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingMore ? t("loading") : t("loadMore")}
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
