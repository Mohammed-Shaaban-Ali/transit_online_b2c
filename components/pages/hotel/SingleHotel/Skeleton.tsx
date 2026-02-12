"use client";

export default function SingleHotelSkeleton() {
  return (
    <section className="py-12 container animate-pulse">
      {/* GalleryOne Skeleton */}
      <section className="pt-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          {/* Hotel Header Skeleton */}
          <div className="flex flex-col flex-1 gap-3">
            <div className="h-10 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
          {/* Price and Rating Skeleton */}
          <div className="flex flex-col gap-3">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>

        {/* Image Gallery Skeleton */}
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-3 h-[70vh] sm:h-[60vh]">
          <div className="relative rounded-lg bg-gray-200 sm:col-span-2 col-span-1 w-full h-full"></div>
          <div className="col-span-1 flex flex-col gap-3 h-full">
            <div className="relative h-full w-full bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-2 gap-3 h-full w-full">
              <div className="relative h-full w-full bg-gray-200 rounded-lg"></div>
              <div className="relative h-full w-full bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section Skeleton */}
      <section className="pt-8">
        <div className="h-7 bg-gray-200 rounded w-32 mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
      </section>

      {/* Available Rooms Skeleton */}
      <section className="pt-8">
        <div className="h-7 bg-gray-200 rounded w-40 mb-3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-gray-200 p-2.5"
            >
              {/* Room Images Skeleton */}
              <div className="grid grid-cols-7 gap-2 mb-2.5">
                <div className="col-span-5 w-full h-[150px] bg-gray-200 rounded-lg"></div>
                <div className="col-span-2 w-full h-[150px] bg-gray-200 rounded-lg"></div>
              </div>
              {/* Room Details Skeleton */}
              <div className="pt-2.5 pb-1 flex flex-col gap-2">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="grid grid-cols-2 gap-4 mb-1 border-b border-gray-200 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="flex items-center gap-2 justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="flex items-start gap-2 justify-between">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-10 bg-gray-200 rounded-full w-full mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Facilities Skeleton */}
      <section className="pt-8">
        <div className="flex items-center justify-between mb-1">
          <div className="h-7 bg-gray-200 rounded w-32"></div>
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center gap-3 min-w-24 min-h-24 bg-gray-100 rounded-lg p-2.5"
            >
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Map Skeleton */}
      <section className="pt-8">
        <div className="h-7 bg-gray-200 rounded w-24 mb-3"></div>
        <div className="w-full h-[400px] bg-gray-200 rounded"></div>
      </section>
    </section>
  );
}
