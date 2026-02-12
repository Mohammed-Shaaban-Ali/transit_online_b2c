"use client";

import { hotelSeachTypes } from "@/types/hotels";
import HotelCard from "./HotelCard";
import Pagination from "../../../shared/Pagination";
import NoHotelsFound from "./NoHotelsFound";
import { HotelCardsSkeleton } from "./Skeletons";

const HotelProperties = ({
  filteredHotels,
  uuid,
  displayedHotels,
  handlePageChange,
  itemsPerPage,
  currentPage,
  isFetching,
  nights,
  adults,
  children,
}: {
  filteredHotels: hotelSeachTypes[];
  uuid: string;
  displayedHotels: hotelSeachTypes[];
  handlePageChange: (page: number) => void;
  itemsPerPage: number;
  currentPage: number;
  isFetching: boolean;
  nights?: number;
  adults?: number;
  children?: number;
}) => {
  if (isFetching && filteredHotels.length === 0) {
    return (
      <div className="container py-4">
        <HotelCardsSkeleton count={5} />
      </div>
    );
  }

  if (filteredHotels.length === 0) {
    return (
      <div className=" py-4">
        <NoHotelsFound />
      </div>
    );
  }

  return (
    <div className=" pb-4">
      <div className="space-y-4">
        {displayedHotels.map((item) => (
          <div key={item?.id}>
            <HotelCard
              hotel={item}
              uuid={uuid}
              nights={nights}
              adults={adults}
              children={children}
            />
          </div>
        ))}
      </div>

      {filteredHotels.length > itemsPerPage && (
        <Pagination
          totalItems={filteredHotels.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default HotelProperties;
