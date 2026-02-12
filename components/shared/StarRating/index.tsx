import React from "react";
import { FaRegStar, FaStar } from "react-icons/fa";

type Props = {
  rating: number;
  className?: string;
};

function StarRating({ rating, className }: Props) {
  const fullStars = Math.floor(rating);

  return (
    <div
      className={`flex items-center sm:justify-end justify-start gap-1 ${className}`}
    >
      {[...Array(5)].map((_, i) => (
        <span key={i}>
          {i < fullStars ? (
            <FaStar className="text-yellow-400" size={20} />
          ) : (
            <FaRegStar className="text-yellow-400" size={20} />
          )}
        </span>
      ))}
    </div>
  );
}

export default StarRating;
