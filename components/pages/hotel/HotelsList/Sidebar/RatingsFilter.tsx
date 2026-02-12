"use client";

import { useHotelFilterRedux } from "@/hooks/useHotelFilterRedux";
import { AiFillStar } from "react-icons/ai";

const ratings = [5, 4, 3, 2, 1];

const RatingsFilter = () => {
  const { hotels, selectedRating, toggleRating } = useHotelFilterRedux();

  const handleRatingClick = (rating: number) => {
    toggleRating(rating);
  };

  return (
    <div className="grid grid-cols-5 gap-2">
      {ratings.map((rating) => {
        const isSelected = selectedRating.includes(rating);
        return (
          <label
            key={rating}
            className={`flex items-center justify-center h-11 cursor-pointer border-2 rounded-md bg-white transition-colors ${
              isSelected
                ? "bg-yellow-500 text-white border-yellow-500"
                : "border-gray-300 hover:bg-yellow-50"
            }`}
          >
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                name="rating"
                checked={isSelected}
                onChange={() => handleRatingClick(rating)}
                className="sr-only"
              />
              <div className="flex items-center justify-center">
                <AiFillStar
                  className={`text-yellow-500 transition-opacity duration-200 ${
                    isSelected ? "opacity-100 text-white!" : "opacity-80"
                  }`}
                  size={20}
                />
                <span
                  className={`ml-1 font-medium ${
                    isSelected ? "text-white" : ""
                  }`}
                >
                  {rating}
                </span>
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
};

export default RatingsFilter;
