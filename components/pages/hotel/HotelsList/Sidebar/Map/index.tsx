"use client";

import { hotelSeachTypes } from "@/types/hotels";
import MapPropertyFinder from "./MapPropertyFinder";
import MapPreview from "./MapPreview";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getSearchParamsData } from "@/utils/getSearchParams";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Map = ({
  hotels,
  autoFocus = false,
}: {
  hotels: hotelSeachTypes[];
  autoFocus?: boolean;
}) => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const searchParams = getSearchParamsData();
    setLocation(searchParams?.location);
  }, []);

  // Calculate center from hotels if autoFocus is true and hotels are available
  const getMapCenter = () => {
    if (hotels && hotels?.length > 0) {
      // Use average of all hotel coordinates for center
      const totalHotels = hotels.length;
      const sumCoords = hotels.reduce(
        (sum, hotel) => {
          if (hotel?.location) {
            return {
              latitude: sum.latitude + (hotel.location.latitude || 0),
              longitude: sum.longitude + (hotel.location.longitude || 0),
            };
          }
          return sum;
        },
        { latitude: 0, longitude: 0 }
      );

      // If we have valid coordinates, return the average
      if (totalHotels > 0) {
        return {
          lat: sumCoords.latitude / totalHotels,
          lng: sumCoords.longitude / totalHotels,
        };
      }
    }

    // Fall back to the search location if autoFocus is false or no hotels
    return {
      lat: location?.latitude as number,
      lng: location?.longitude as number,
    };
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className="relative w-full h-[120px] rounded-2xl overflow-hidden cursor-pointer group">
            <MapPreview
              hotels={hotels}
              center={getMapCenter()}
              height="120px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200"></div>
          </div>
        </DialogTrigger>

        <DialogContent className="w-full md:min-w-[900px] max-w-[95vw] p-0 gap-0">
          <DialogHeader className="px-6 pt-4 pb-4 mb-0 border-b">
            <DialogTitle className="text-xl font-semibold">
              Hotel Locations
            </DialogTitle>
          </DialogHeader>
          <div className="p-0 w-full" style={{ height: "70vh" }}>
            <MapPropertyFinder hotels={hotels} center={getMapCenter()} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Map;
