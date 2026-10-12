function CruiseResultsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
        >
          <div className="aspect-2/1 animate-pulse bg-gray-200" />
          <div className="space-y-3 p-4">
            <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="h-10 animate-pulse bg-primary/10" />
        </div>
      ))}
    </div>
  );
}

export default CruiseResultsSkeleton;
