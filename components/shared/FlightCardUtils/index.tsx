import { useFlightUtils } from "@/hooks/useFlightUtils";
import { Leg } from "@/types/flightTypes";
import { useTranslations } from "next-intl";


export const FlightData = ({
  date,
  airportCode,
}: {
  date: string;
  airportCode: string;
}) => {
  const { formatTime, formatDate } = useFlightUtils();
  return (
    <div className="text-center ">
      <div className="text-22 font-bold  ">{formatTime(date)}</div>
      <span className="text-14 font-medium">{airportCode}</span>
      <div className="text-14 flex items-center  font-medium justify-center text-nowrap flex-col sm:flex-row">
        {formatDate(date)}
        {/* <span className="mx-1 sm:block hidden">•</span> */}
      </div>
    </div>
  );
};

export const FlightLegsData = ({ legs }: { legs: Leg[] }) => {
  const tDirect = useTranslations("FlightSidebar");

  const { formatDuration } = useFlightUtils();
  return (
    <div className=" relative w-full  ">
      <div className="h-0.5 bg-black rounded-full"></div>
      <div className="absolute sm:-top-10 -top-9 left-1/2 transform -translate-x-1/2 ">
        <div className=" px-2">
          <span className="text-11 sm:text-14 text-nowrap font-bold text-black">
            {formatDuration(
              legs?.[0]?.time_info?.flight_time_hour * 60 +
              legs?.[0]?.time_info?.flight_time_minute
            )}
          </span>
        </div>
      </div>
      {legs?.length === 1 ? (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1">
          <span
            className=" border border-gray-400 text-white text-11 sm:text-14 font-bold sm:px-2 px-1 sm:py-1 py-0.5 
                    rounded bg-primary"
          >
            {tDirect("direct")}{" "}
          </span>
        </div>
      ) : (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-1">
          {legs?.map((leg: any, i: number) => {
            if (i === 0) return null;
            return (
              <span
                key={i}
                className="bg-gray-50 border border-gray-500 text-black font-bold 
                          text-11 sm:text-14 sm:px-2 px-1 sm:py-1 py-0.5 rounded  "
              >
                {leg.departure_info?.airport_code}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};


