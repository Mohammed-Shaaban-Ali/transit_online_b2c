"use client";

import { useTranslations } from "next-intl";

interface NoResultsPageProps {
  adults: number;
  cabinClass: string;
  childrenCount: number;
  departureDate: string;
  infants: number;
  error?: any;
  returnDate: string;
  fromAirport: string;
  toAirport: string;
}

const NoResultsPage: React.FC<NoResultsPageProps> = ({ error }) => {
  const tError = useTranslations("FlightsList.error");
  const tNoResults = useTranslations("FlightsList.noResults");
  
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <svg
            className="mx-auto h-24 w-24 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          {error ? tError("title") : tNoResults("title")}
        </h2>
        <p className="text-gray-600 mb-6">
          {error ? tError("description") : tNoResults("description")}
        </p>
      </div>
    </div>
  );
};

export default NoResultsPage;
