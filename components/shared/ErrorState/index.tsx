"use client";

import { FC } from "react";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: any;
  isHotel?: boolean;
}

const ErrorState: FC<ErrorStateProps> = ({ error, isHotel = true }) => {
  const t = useTranslations("HotelsList.error");

  return (
    <div className="max-w-xl w-full mb-8 mx-auto">
      <div className="bg-red-50/80 rounded-2xl  p-4 sm:p-8 text-center border border-red-200">
        {/* Icon */}
        <div className="mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-1">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-22 font-bold text-red-600 mb-2">
            {isHotel ? t("title") : t("titleFlight")}
          </h2>
        </div>

        {/* Error message */}
        <div className="bg-red-100/70 border border-red-200 rounded-lg p-2 sm:p-4 ">
          <p className="text-14 text-red-600 text-center font-medium">
            {error?.data?.message || "An unexpected error occurred"}
          </p>
        </div>


      </div>
    </div>


  );
};

export default ErrorState;