export const SidebarSkeleton = () => {
  return (
    <div className=" space-y-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-7 bg-gray-200 rounded w-24"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export const FlightCardsSkeleton = ({ count = 5 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg relative border md:p-4 p-4 pt-6 border-gray-300 animate-pulse"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Airline - Desktop only */}
            <div className="flex-col items-center md:max-w-[140px] w-full hidden md:flex">
              <div className="w-12 h-12 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-20 mt-1 mx-auto"></div>
            </div>

            {/* Flight Route */}
            <div className="flex-1 min-w-0 w-full md:w-auto">
              <div className="flex items-center gap-5 relative">
                {/* Departure */}
                <div className="text-center">
                  <div className="h-7 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>

                {/* Flight Line */}
                <div className="relative w-full">
                  <div className="h-0.5 bg-gray-200 rounded-full"></div>
                  {/* Duration badge */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  {/* Direct/Stop badge */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="h-6 bg-gray-200 rounded w-14"></div>
                  </div>
                </div>

                {/* Arrival */}
                <div className="text-center md:border-e md:pe-4 border-gray-300">
                  <div className="h-7 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="flex md:justify-end items-center gap-2 justify-between w-full md:w-auto">
              {/* Airline - Mobile only */}
              <div className="flex-col items-start w-full flex md:hidden">
                <div className="w-12 h-12 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-20 mt-1"></div>
              </div>

              {/* Price and Button */}
              <div className="md:min-w-[160px] w-full md:w-auto flex flex-col items-end justify-center">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-7 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-9 md:h-10 bg-gray-200 rounded-full w-32"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
