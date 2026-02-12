"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

interface ReturnFlightsSectionProps {
  matchingReturns: any[];
  departureFlightData: any;
  onSelectFlight: (departureFlightData: any, returnFlightData?: any) => void;
  formatTime: (dateString: string) => string;
  formatDuration: (minutes: number) => string;
  formatDate: (dateString: string) => string;
}

const ReturnFlightsSection = memo<ReturnFlightsSectionProps>(
  ({
    matchingReturns,
    departureFlightData,
    onSelectFlight,
    formatTime,
    formatDuration,
    formatDate,
  }) => {
    if (matchingReturns.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-lg font-semibold text-gray-900 mb-3">
          Return Flights ({matchingReturns?.length})
        </h5>
        <div className="space-y-2">
          {matchingReturns
            .slice(0, 3)
            .map((returnFlight: any, index: number) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-primary transition-colors cursor-pointer"
                onClick={() =>
                  onSelectFlight(departureFlightData, returnFlight)
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatTime(
                          returnFlight?.legs?.[0]?.departure_info?.date || ""
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {returnFlight?.legs?.[0]?.departure_info?.airport_code}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="h-0.5 bg-gray-300 rounded-full"></div>
                      <div className="text-center text-xs text-gray-500 mt-1">
                        {formatDuration(
                          returnFlight?.legs?.[0]?.time_info?.flight_time_hour *
                            60 +
                            returnFlight?.legs?.[0]?.time_info
                              ?.flight_time_minute
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatTime(
                          returnFlight?.legs?.[returnFlight?.legs?.length - 1]
                            ?.arrival_info?.date || ""
                        )}
                      </div>
                      <div className="text-xs text-gray-600">
                        {
                          returnFlight?.legs?.[returnFlight?.legs?.length - 1]
                            ?.arrival_info?.airport_code
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-primary">
                      {
                        returnFlight?.fares?.[0]?.fare_info?.fare_detail
                          ?.currency_code
                      }{" "}
                      {returnFlight?.fares?.[0]?.fare_info?.fare_detail?.price_info?.total_fare?.toFixed(
                        2
                      ) || "0.00"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          {matchingReturns.length > 3 && (
            <div className="text-center text-sm text-primary mt-2">
              + {matchingReturns.length - 3} more options
            </div>
          )}
        </div>
      </div>
    );
  }
);

ReturnFlightsSection.displayName = "ReturnFlightsSection";

export default ReturnFlightsSection;
