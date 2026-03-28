import { FlightDirection } from "@/types/flightTypes";
import { useTranslations } from "next-intl";
import { FareCard } from "@/components/pages/flights-test/showfarefirst/FareSelectionDialog/FareCard";
import { buildDefaultFareCardOption } from "@/components/pages/flights-test/showfarefirst/FareSelectionDialog/fareDialogUtils";

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

  const DEFAULT_CABIN = "1 Bage (7 Kg)";

  const getDepartureBaggageInfo = () => {
    const fareDetail = departureFlightData.fares?.[0]?.fare_info
      ?.fare_detail as any;
    const bt = fareDetail?.baggages_text;
    return {
      cabin: DEFAULT_CABIN,
      checked: bt?.[0] || t("notIncluded"),
    };
  };

  const getReturnBaggageInfo = () => {
    const fareDetail = data?.data?.fare_detail as any;
    const bt = fareDetail?.baggages_text;
    const last = Math.max(0, (bt?.length ?? 1) - 1);
    return {
      cabin: DEFAULT_CABIN,
      checked: bt?.[last] || t("notIncluded"),
    };
  };

  const departureBaggage = getDepartureBaggageInfo();
  const returnBaggage = getReturnBaggageInfo();

  const departurePrice =
    departureFlightData.fares?.[0]?.fare_info?.fare_detail?.price_info
      ?.total_fare || 0;

  const returnPrice = data?.data?.fare_detail?.price_info?.total_fare || 0;

  const notInc = t("notIncluded");

  const toBag = (cabin: string, checked: string) => ({
    cabinCarry:
      cabin && cabin !== notInc ? cabin : (false as const),
    checked: checked && checked !== notInc ? checked : (false as const),
  });

  const depBag = toBag(departureBaggage.cabin, departureBaggage.checked);
  const retBag = toBag(returnBaggage.cabin, returnBaggage.checked);

  const departureFare = buildDefaultFareCardOption({
    id: "default-departure",
    cabinClass: t("defaultOffer"),
    fareType: "",
    cabinCarry: depBag.cabinCarry,
    checked: depBag.checked,
    price: departurePrice,
  });

  const returnFare = buildDefaultFareCardOption({
    id: "default-return",
    cabinClass: t("defaultOffer"),
    fareType: "",
    cabinCarry: retBag.cabinCarry,
    checked: retBag.checked,
    price: returnPrice,
  });

  return (
    <div className="bg-white border-0 mb-3 rounded-lg">
      <div className="p-4">
        {!showReturnOffers && (
          <div className="mb-3">
            <h4 className="text-base font-bold mb-4">{t("departureFlight")}</h4>
            <div className="max-w-[300px] w-full">
              <FareCard
                fare={departureFare}
                isSelected={selectedDepartureOffer === "default"}
                onSelect={() => {
                  if (returnFareKey) {
                    setShowReturnOffers(true);
                    setReturnFareKey(returnFareKey);
                    setSelectedOfferKey("default");
                  }
                }}
              />
            </div>
          </div>
        )}

        {showReturnOffers && returnFareKey && (
          <div>
            <h4 className="text-base font-bold mb-4">{t("returnFlight")}</h4>
            <div className="max-w-[300px] w-full">
              <FareCard
                fare={returnFare}
                isSelected={selectedOfferKey === "default"}
                onSelect={() => {
                  setSelectedOfferKey("default");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DefaultOfferDisplay;
