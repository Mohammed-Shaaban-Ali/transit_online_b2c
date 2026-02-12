import { FlightDirection } from "@/types/flightTypes";
import { FaBriefcase, FaSuitcase } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import CurrencySymbol from "@/components/shared/PriceCell/CurrencySymbol";
import { FaRegCircleCheck } from "react-icons/fa6";
import { useTranslations } from "next-intl";
import { formatePrice } from "@/utils/formatePrice";

interface DefaultOfferDisplayProps {
  showReturnOffers: boolean;
  selectedDepartureOffer: string;
  returnFareKey: string;
  setReturnFareKey: (returnFareKey: string) => void;
  departureFlightData: FlightDirection;
  selectedOfferKey: string;
  setSelectedOfferKey: (selectedOfferKey: string) => void;
  data: any;
  setShowReturnOffers: (showReturnOffers: boolean) => void;
}

function DefaultOfferDisplay({
  showReturnOffers,
  selectedDepartureOffer,
  returnFareKey,
  departureFlightData,
  selectedOfferKey,
  setReturnFareKey,
  setSelectedOfferKey,
  data,
  setShowReturnOffers,
}: DefaultOfferDisplayProps) {
  const t = useTranslations("DefaultOfferDisplay");
  // Get baggage info for departure
  const getDepartureBaggageInfo = () => {
    const fareDetail = departureFlightData.fares?.[0]?.fare_info
      ?.fare_detail as any;
    return {
      cabin: fareDetail?.cabin_baggages_text?.[0] || t("notIncluded"),
      checked: fareDetail?.baggages_text?.[0] || t("notIncluded"),
    };
  };

  // Get baggage info for return
  const getReturnBaggageInfo = () => {
    const fareDetail = data?.data?.fare_detail as any;
    return {
      cabin:
        "1 Bage (7 Kg)",
      // fareDetail?.cabin_baggages_text?.[
      //   fareDetail?.cabin_baggages_text?.length - 1
      // ] || t("notIncluded"),
      checked:
        fareDetail?.baggages_text?.[fareDetail?.baggages_text?.length - 1] ||
        t("notIncluded"),
    };
  };

  const departureBaggage = getDepartureBaggageInfo();
  const returnBaggage = getReturnBaggageInfo();

  // Get departure price
  const departurePrice =
    departureFlightData.fares?.[0]?.fare_info?.fare_detail?.price_info
      ?.total_fare || 0;

  // Get return price
  const returnPrice = data?.data?.fare_detail?.price_info?.total_fare || 0;

  return (
    <div className="bg-white border-0 mb-3 rounded-lg">
      <div className="p-4">
        {/* Default Departure Offer */}
        {!showReturnOffers && (
          <div className="mb-3 ">
            <h4 className="text-base font-bold mb-7">{t("departureFlight")}</h4>
            <div
              className={`bg-white mt-4 border-2 rounded-xl relative  w-full max-w-[360px]  cursor-pointer p-4 flex flex-col h-full ${selectedDepartureOffer === "default"
                  ? "border-primary"
                  : "border-gray-200"
                }`}
              onClick={() => {
                if (returnFareKey) {
                  setShowReturnOffers(true);
                  setReturnFareKey(returnFareKey);
                  setSelectedOfferKey("default");
                }
              }}
            >
              <div className="absolute  top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div
                  className="px-3 h-8 flex items-center justify-center bg-primary rounded
             text-white text-15 font-bold gap-1.5"
                >
                  <FaRegCircleCheck size={16} fill="white" stroke="white" />
                  {t("selected")}
                </div>
              </div>

              {/* name and price */}
              <div className="flex flex-col items-center justify-center gap-0">
                <h3 className="font-bold text-22">{t("defaultOffer")}</h3>
                {/* Price */}
                <div className="flex items-center gap-1 text-28 font-bold text-primary rtl:flex-row-reverse">
                  <CurrencySymbol size="lg" />
                  {formatePrice(departurePrice || 0)}
                </div>
              </div>

              {/* select button */}
              <Button
                className={`h-11 rounded-full mt-3 ${selectedDepartureOffer === "default"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-primary/15 text-primary hover:bg-primary/30"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (returnFareKey) {
                    setShowReturnOffers(true);
                    setReturnFareKey(returnFareKey);
                    setSelectedOfferKey("default");
                  }
                }}
              >
                {t("selectPackage")}
              </Button>

              {/* Travel Essentials Section */}
              <div className="mt-6 mb-2">
                <h4 className="text-14 text-gray-600 mb-3">
                  {t("travelEssentials")}
                </h4>

                <div className="flex flex-col gap-4">
                  {/* Cabin Baggage */}
                  <div className="flex items-start gap-2.5">
                    <div className="shrink-0 rounded-full p-3 bg-primary/10">
                      <FaBriefcase className="text-primary" size={18} />
                    </div>
                    <div className="grow">
                      <div className="text-14 font-medium">
                        {t("cabinBaggage")}
                      </div>
                      <div className="text-12 font-normal text-gray-500">
                        {departureBaggage.cabin}
                      </div>
                    </div>
                  </div>

                  {/* Checked Baggage */}
                  <div className="flex items-start gap-2.5">
                    <div className="shrink-0 rounded-full p-3 bg-secondary/10">
                      <FaSuitcase className="text-secondary" size={18} />
                    </div>
                    <div className="grow">
                      <div className="text-14 font-medium">
                        {t("checkedBaggage")}
                      </div>
                      <div className="text-12 font-normal text-gray-500">
                        {departureBaggage.checked}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Default Return Offer */}
        {showReturnOffers && returnFareKey && (
          <div>
            <h4 className="text-base font-bold   mb-4">{t("returnFlight")}</h4>

            <div
              className={`bg-white mt-7 border-2 rounded-xl relative  w-full max-w-[360px]  cursor-pointer p-4 flex flex-col h-full ${selectedOfferKey === "default"
                  ? "border-primary"
                  : "border-gray-200"
                }`}
              onClick={() => {
                setSelectedOfferKey("default");
              }}
            >
              {" "}
              <div className="absolute  top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div
                  className="px-3 h-8 flex items-center justify-center bg-primary rounded
             text-white text-15 font-bold gap-1.5"
                >
                  <FaRegCircleCheck size={16} fill="white" stroke="white" />
                  {t("selected")}
                </div>
              </div>
              {/* name and price */}
              <div className="flex flex-col items-center justify-center gap-0">
                <h3 className="font-bold text-22">{t("defaultOffer")}</h3>
                {/* Price */}
                <div className="flex items-center gap-1 text-28 font-bold text-primary rtl:flex-row-reverse">
                  <CurrencySymbol size="lg" />
                  {formatePrice(returnPrice || 0)}
                </div>
              </div>
              {/* select button */}
              <Button
                className={`h-11 rounded-full mt-3 ${selectedOfferKey === "default"
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-primary/15 text-primary hover:bg-primary/30"
                  }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOfferKey("default");
                }}
              >
                {t("selectPackage")}
              </Button>
              {/* Travel Essentials Section */}
              <div className="mt-6 mb-2">
                <h4 className="text-14 text-gray-600 mb-3">
                  {t("travelEssentials")}
                </h4>

                <div className="flex flex-col gap-4">
                  {/* Cabin Baggage */}
                  <div className="flex items-start gap-2.5">
                    <div className="shrink-0 rounded-full p-3 bg-primary/10">
                      <FaBriefcase className="text-primary" size={18} />
                    </div>
                    <div className="grow">
                      <div className="text-14 font-medium">
                        {t("cabinBaggage")}
                      </div>
                      <div className="text-12 font-normal text-gray-500">
                        {returnBaggage.cabin}
                      </div>
                    </div>
                  </div>

                  {/* Checked Baggage */}
                  <div className="flex items-start gap-2.5">
                    <div className="shrink-0 rounded-full p-3 bg-secondary/10">
                      <FaSuitcase className="text-secondary" size={18} />
                    </div>
                    <div className="grow">
                      <div className="text-14 font-medium">
                        {t("checkedBaggage")}
                      </div>
                      <div className="text-12 font-normal text-gray-500">
                        {returnBaggage.checked}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DefaultOfferDisplay;
