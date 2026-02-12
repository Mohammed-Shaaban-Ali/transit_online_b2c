"use client";

// Hotel Card Skeleton
export const HotelCardSkeleton = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden p-2 flex items-center flex-col sm:flex-row gap-2 mb-4 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative shrink-0 w-full sm:w-[220px] sm:h-[220px] bg-gray-200 rounded-lg"></div>

      {/* Content Skeleton */}
      <div className="flex flex-col gap-2 p-2 w-full">
        <div className="flex items-start justify-between sm:gap-5 gap-3 flex-col sm:flex-row w-full">
          <div className="flex flex-col gap-3 w-full ">
            {/* Hotel Name Skeleton */}
            <div className="h-7 bg-gray-200 rounded w-3/4"></div>

            {/* Location Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>

            {/* Breakfast Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>

            {/* Nights/Guests Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          {/* Price Section Skeleton */}
          <div className="flex flex-col gap-5 w-full sm:w-auto sm:items-end">
            <div>
              {/* Price Skeleton */}
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              {/* Star Rating Skeleton */}
              <div className="h-5 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mt-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Skeleton
export const SidebarSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Map Skeleton */}
      <div className="w-full h-[120px] bg-gray-200 rounded-lg"></div>

      {/* Filters Container Skeleton */}
      <div className="bg-primary-light rounded-2xl p-4 space-y-6">
        {/* Search Box Skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-32 mb-2.5"></div>
          <div className="h-10 bg-gray-200 rounded-lg"></div>
        </div>

        {/* Star Rating Skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-24 mb-2.5"></div>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>

        {/* Hotel Chain Skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-28 mb-2.5"></div>
          <div className="flex flex-col gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Type Skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-32 mb-2.5"></div>
          <div className="flex flex-col gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Nightly Price Skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-28 mb-2.5"></div>
          <div className="space-y-4">
            <div className="h-2 bg-gray-200 rounded"></div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        </div>

        {/* Facilities Skeleton */}
        <div>
          <div className="h-5 bg-gray-300 rounded w-20 mb-2.5"></div>
          <div className="flex flex-col gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Multiple Hotel Cards Skeleton
export const HotelCardsSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <HotelCardSkeleton key={index} />
      ))}
    </div>
  );
};
