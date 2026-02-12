"use client";

import { formatePrice } from "@/utils/formatePrice";
import { CURRENCY_CONFIG } from "@/config/currency";
import { FaStar } from "react-icons/fa";

export default function SidebarRight({ hotel }: { hotel?: any }) {
  if (!hotel) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
      <div className="space-y-6">
        {/* Price Section */}
        <div>
          <div className="text-3xl font-bold text-primary mb-1">
            {CURRENCY_CONFIG.currencySymbolEn} {formatePrice(hotel?.price || 0)}
          </div>
          <div className="text-sm text-gray-500">per night</div>
        </div>

        {/* Rating Section */}
        {hotel?.starRating && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`${
                    i < Number(hotel.starRating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                  size={16}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {hotel.starRating} stars
            </span>
          </div>
        )}

        {/* Reviews Section */}
        {hotel?.reviews && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg font-semibold">
                {hotel.reviews.score}
              </span>
              <span className="text-sm text-gray-600">
                {hotel.reviews.scoreDescription}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              ({hotel.reviews.reviewsCount} guest ratings)
            </div>
          </div>
        )}

        {/* Book Now Button */}
        <a
          href="#rooms"
          className="block w-full text-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Book Now
        </a>

        {/* Additional Info */}
        <div className="pt-4 border-t border-gray-200 space-y-3 text-sm">
          {hotel?.propertyType && (
            <div className="flex justify-between">
              <span className="text-gray-600">Property Type:</span>
              <span className="font-medium">{hotel.propertyType}</span>
            </div>
          )}
          {hotel?.address && (
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium text-right">{hotel.address}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
