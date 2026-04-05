export function HotelsTestHotelCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row overflow-hidden rounded-lg border border-gray-200 bg-white animate-pulse">
      <div className="h-[200px] sm:h-auto sm:w-[220px] shrink-0 bg-gray-200" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
          </div>
          <div className="h-8 w-8 rounded-md bg-gray-200" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-1/4 rounded bg-gray-200" />
        </div>
        <div className="mt-auto flex justify-between items-end">
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="space-y-1 items-end flex flex-col">
            <div className="h-6 w-20 rounded bg-gray-200" />
            <div className="h-3 w-32 rounded bg-gray-200" />
            <div className="h-7 w-28 rounded-md bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HotelsTestHotelCardSkeletons({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <HotelsTestHotelCardSkeleton key={i} />
      ))}
    </div>
  );
}
