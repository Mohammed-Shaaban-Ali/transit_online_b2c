/**
 * Utility functions for transforming flight data to cart and booking formats
 */

interface FlightSegment {
  type: "go" | "return";
  departure_date: string;
  take_off: string;
  arrival_date: string;
  landing: string;
  airport_from_id: string;
  airport_to_id: string;
  airline_id: string;
  weight: string;
  // cabin_class?: string;
}

interface FlightBookingData {
  date: string;
  supplier: string;
  buy_price: number;
  buy_currency_id: number;
  sell_price: string;
  sell_currency_id: number;
  adults: number;
  children: number;
  infants: number;
  segments: FlightSegment[];
}

/**
 * Extract date only from datetime string (format: "YYYY-MM-DD HH:mm:ss")
 */
function extractDate(dateTime: string): string {
  if (!dateTime) return "";
  return dateTime.split(" ")[0];
}

/**
 * Extract time only from datetime string (format: "YYYY-MM-DD HH:mm:ss")
 * Returns format: "HH:mm"
 */
function extractTime(dateTime: string): string {
  if (!dateTime) return "";
  const timePart = dateTime.split(" ")[1];
  if (!timePart) return "";
  return timePart.substring(0, 5); // Get HH:mm
}

/**
 * Transform flight data to booking format
 */
export function transformFlightToBookingData(
  flightItem: any,
  searchParams: {
    adults: number;
    children: number;
    infants: number;
  }
): FlightBookingData {
  const { adults, children, infants } = searchParams;
  const {
    fareData,
    selectedOffer,
    departureFlightData,
    returnFlightData,
    provider,
  } = flightItem;

  // Determine buy price - use the buyPrice from cart item if available
  let buyPrice = flightItem.buyPrice || 0;
  if (!buyPrice) {
    if (
      selectedOffer &&
      fareData?.data?.offers &&
      fareData.data.offers.length > 0
    ) {
      // Use selected offer price
      buyPrice = selectedOffer.total_price || 0;
    } else if (fareData?.data?.fare_detail) {
      // Use default fare detail price
      buyPrice = fareData.data.fare_detail.price_info?.total_fare || 0;
    }
  }

  // Get supplier from departure flight endpoint
  const supplier = departureFlightData?.endpoint || provider || "iati";

  // Get departure date from first leg
  const departureDate =
    departureFlightData?.legs?.[0]?.departure_info?.date || "";

  // Get cabin class from flightItem
  const cabinClass = flightItem.cabinClass || "ECONOMY";

  // Build segments
  const segments: FlightSegment[] = [];

  // Use departure_selected_flights from fareData if available, otherwise use departureFlightData.legs
  const departureFlights = fareData?.data?.departure_selected_flights || [];
  const returnFlights = fareData?.data?.return_selected_flight || [];

  // Add departure segments (type: "go")
  if (departureFlights.length > 0) {
    // Use selected flights from fare response
    departureFlights.forEach((selectedFlight: any) => {
      const flight = selectedFlight.flight;
      // Get baggage weight
      let weight = "";
      if (
        selectedOffer &&
        selectedOffer.baggages_text &&
        selectedOffer.baggages_text.length > 0
      ) {
        weight = selectedOffer.baggages_text[0];
      } else if (
        fareData?.data?.fare_detail?.baggages_text &&
        fareData.data.fare_detail.baggages_text.length > 0
      ) {
        weight = fareData.data.fare_detail.baggages_text[0];
      }

      segments.push({
        type: "go",
        departure_date: extractDate(flight.departure_time || ""),
        take_off: extractTime(flight.departure_time || ""),
        arrival_date: extractDate(flight.arrival_time || ""),
        landing: extractTime(flight.arrival_time || ""),
        airport_from_id: flight.from || "",
        airport_to_id: flight.to || "",
        airline_id: flight.operator_airline_code || "",
        weight: weight,
        // cabin_class: cabinClass,
      });
    });
  } else if (departureFlightData?.legs) {
    // Fallback to legs if selected flights not available
    departureFlightData.legs.forEach((leg: any) => {
      // Get baggage weight
      let weight = "";
      if (
        selectedOffer &&
        selectedOffer.baggages_text &&
        selectedOffer.baggages_text.length > 0
      ) {
        weight = selectedOffer.baggages_text[0];
      } else if (
        fareData?.data?.fare_detail?.baggages_text &&
        fareData.data.fare_detail.baggages_text.length > 0
      ) {
        weight = fareData.data.fare_detail.baggages_text[0];
      }

      segments.push({
        type: "go",
        departure_date: extractDate(leg.departure_info?.date || ""),
        take_off: extractTime(leg.departure_info?.date || ""),
        arrival_date: extractDate(leg.arrival_info?.date || ""),
        landing: extractTime(leg.arrival_info?.date || ""),
        airport_from_id: leg.departure_info?.airport_code || "",
        airport_to_id: leg.arrival_info?.airport_code || "",
        airline_id: leg.airline_info?.carrier_code || "",
        weight: weight,
        // cabin_class: cabinClass,
      });
    });
  }

  // Add return segments (type: "return")
  if (returnFlights.length > 0) {
    // Use selected flights from fare response
    returnFlights.forEach((selectedFlight: any) => {
      const flight = selectedFlight.flight;
      // Get baggage weight for return
      let weight = "";
      if (
        selectedOffer &&
        selectedOffer.baggages_text &&
        selectedOffer.baggages_text.length > 1
      ) {
        weight =
          selectedOffer.baggages_text[selectedOffer.baggages_text.length - 1];
      } else if (
        fareData?.data?.fare_detail?.baggages_text &&
        fareData.data.fare_detail.baggages_text.length > 1
      ) {
        weight =
          fareData.data.fare_detail.baggages_text[
            fareData.data.fare_detail.baggages_text.length - 1
          ];
      }

      segments.push({
        type: "return",
        departure_date: extractDate(flight.departure_time || ""),
        take_off: extractTime(flight.departure_time || ""),
        arrival_date: extractDate(flight.arrival_time || ""),
        landing: extractTime(flight.arrival_time || ""),
        airport_from_id: flight.from || "",
        airport_to_id: flight.to || "",
        airline_id: flight.operator_airline_code || "",
        weight: weight,
        // cabin_class: cabinClass,
      });
    });
  } else if (returnFlightData?.legs) {
    // Fallback to legs if selected flights not available
    returnFlightData.legs.forEach((leg: any) => {
      // Get baggage weight for return
      let weight = "";
      if (
        selectedOffer &&
        selectedOffer.baggages_text &&
        selectedOffer.baggages_text.length > 1
      ) {
        weight =
          selectedOffer.baggages_text[selectedOffer.baggages_text.length - 1];
      } else if (
        fareData?.data?.fare_detail?.baggages_text &&
        fareData.data.fare_detail.baggages_text.length > 1
      ) {
        weight =
          fareData.data.fare_detail.baggages_text[
            fareData.data.fare_detail.baggages_text.length - 1
          ];
      }

      segments.push({
        type: "return",
        departure_date: extractDate(leg.departure_info?.date || ""),
        take_off: extractTime(leg.departure_info?.date || ""),
        arrival_date: extractDate(leg.arrival_info?.date || ""),
        landing: extractTime(leg.arrival_info?.date || ""),
        airport_from_id: leg.departure_info?.airport_code || "",
        airport_to_id: leg.arrival_info?.airport_code || "",
        airline_id: leg.airline_info?.carrier_code || "",
        weight: weight,
        // cabin_class: cabinClass,
      });
    });
  }

  return {
    date: extractDate(departureDate),
    supplier: supplier,
    buy_price: buyPrice,
    buy_currency_id: 1,
    sell_price: "", // Empty initially, will be set in cart
    sell_currency_id: 1,
    adults: adults,
    children: children,
    infants: infants,
    segments: segments,
  };
}
