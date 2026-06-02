"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import NewNavbar from "@/components/shared/Navbar/NewNavbar";
import { useGetFeaturedDestinationDetailsQuery } from "@/redux/features/website/websiteApi";

function FeaturedDestinationDetailsPage() {
  const params = useParams<{ id: string }>();
  const destinationId = params?.id;
  const { data, isLoading } = useGetFeaturedDestinationDetailsQuery(
    destinationId,
    {
      skip: !destinationId,
    },
  );
  console.log(data?.data);
  const imageUrl = `https://gita.sa/storage/${data?.data?.featured_image}`;
  return (
    <>
      <NewNavbar isBgWhite />
      <section className="container mx-auto w-full max-w-[1200px]! px-3 pb-8 pt-28 md:pt-24">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 rounded-lg   bg-white p-4 md:grid-cols-2">
            <div className="h-[280px] animate-pulse rounded-lg bg-gray-200 md:h-[420px]" />
            <div className="space-y-3 pt-2">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 relative">
            <div
              className="relative md:top-5 md:sticky md:h-[calc(100vh-50px)] h-[280px] overflow-hidden rounded-xl border border-gray-200
             "
            >
              <Image
                src={imageUrl}
                alt={data?.data?.title || "destination"}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[28px] font-bold leading-tight text-black">
                {data?.data?.title}
              </h1>
              <p className="mt-4 whitespace-pre-line text-[16px] leading-7 text-gray-700">
                {data?.data?.description || data?.data?.short_description}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default FeaturedDestinationDetailsPage;
