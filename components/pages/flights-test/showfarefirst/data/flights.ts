export type FareOption = {
  id: string;
  cabinClass: string;
  fareType: string;
  recommended?: boolean;
  baggage: {
    personalItem: boolean;
    carryOn: string | false;
    checked: string | false;
  };
  flexibility: {
    refundable: boolean;
    changeFee: string | false;
  };
  tripFlex?: {
    label: string;
    benefits: number;
    cancellationFee: string;
    originalPrice: string;
    note: string;
  };
  otherBenefits?: string[];
  note?: string;
  price: number;
  currency: string;
  /** Appended after formatted price (e.g. "+" for return add-on, matches OfferCard / OfferSelection). */
  priceSuffix?: string;
};

export type FlightData = {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  cabinClass: string;
  aircraftType?: string;
  departureTime: string;
  departureCode: string;
  departureAirport: string;
  arrivalTime: string;
  arrivalCode: string;
  arrivalAirport: string;
  duration: string;
  stops: string;
  price: number;
  currency: string;
  exclusive?: boolean;
  fareOptions: FareOption[];
};

export const departureFlights: FlightData[] = [
  {
    id: "dep-1",
    airline: "American Airlines",
    airlineCode: "AA",
    flightNumber: "AA1739",
    cabinClass: "Economy class",
    aircraftType: "Airbus A321",
    departureTime: "19:25",
    departureCode: "LGA B",
    departureAirport: "New York LaGuardia B",
    arrivalTime: "22:51",
    arrivalCode: "MIA",
    arrivalAirport: "Miami Intl.",
    duration: "3h 26m",
    stops: "Nonstop",
    price: 228,
    currency: "US$",
    exclusive: true,
    fareOptions: [
      {
        id: "fare-aa1-basic",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        otherBenefits: ["Airline miles: Eligible", "Itinerary will be split across multiple bookings and flight tickets"],
        price: 398,
        currency: "US$",
      },
      {
        id: "fare-aa1-tripflex",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        recommended: true,
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        tripFlex: {
          label: "TripFlex · EasyCancel Plus",
          benefits: 4,
          cancellationFee: "Free",
          originalPrice: "US$398",
          note: "* Valid before departure of the first flight. Not transferable to changed flights.",
        },
        otherBenefits: ["Airline miles: Eligible", "Itinerary will be split across multiple bookings and flight tickets"],
        price: 398,
        currency: "US$",
      },
      {
        id: "fare-aa1-maincabin",
        cabinClass: "Economy class",
        fareType: "Main Cabin",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Seat selection available", "Airline miles: at least 2,002"],
        price: 463,
        currency: "US$",
      },
    ],
  },
  {
    id: "dep-2",
    airline: "Spirit Airlines",
    airlineCode: "NK",
    flightNumber: "NK2890",
    cabinClass: "Economy class",
    aircraftType: "Airbus A320-212",
    departureTime: "16:13",
    departureCode: "EWR B",
    departureAirport: "Newark Liberty International B",
    arrivalTime: "19:16",
    arrivalCode: "MIA",
    arrivalAirport: "Miami International Airport",
    duration: "3h 3m",
    stops: "Nonstop",
    price: 228,
    currency: "US$",
    exclusive: true,
    fareOptions: [
      {
        id: "fare-nk2-basic",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        baggage: {
          personalItem: true,
          carryOn: false,
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        price: 228,
        currency: "US$",
      },
      {
        id: "fare-nk2-standard",
        cabinClass: "Economy class",
        fareType: "Standard",
        recommended: true,
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Airline miles: Eligible"],
        price: 298,
        currency: "US$",
      },
      {
        id: "fare-nk2-flexi",
        cabinClass: "Economy class",
        fareType: "Flexi",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: "1 piece",
        },
        flexibility: {
          refundable: true,
          changeFee: "Free",
        },
        otherBenefits: ["Seat selection available", "Airline miles: at least 1,500"],
        price: 378,
        currency: "US$",
      },
    ],
  },
  {
    id: "dep-3",
    airline: "Delta Air Lines",
    airlineCode: "DL",
    flightNumber: "DL2041",
    cabinClass: "Economy class",
    aircraftType: "Boeing 737 MAX 8",
    departureTime: "06:00",
    departureCode: "JFK",
    departureAirport: "John F. Kennedy International",
    arrivalTime: "09:10",
    arrivalCode: "MIA",
    arrivalAirport: "Miami International Airport",
    duration: "3h 10m",
    stops: "Nonstop",
    price: 312,
    currency: "US$",
    fareOptions: [
      {
        id: "fare-dl3-basic",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        price: 312,
        currency: "US$",
      },
      {
        id: "fare-dl3-main",
        cabinClass: "Economy class",
        fareType: "Main Cabin",
        recommended: true,
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: "1 piece",
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Seat selection available", "Airline miles: at least 2,200"],
        price: 389,
        currency: "US$",
      },
      {
        id: "fare-dl3-comfort",
        cabinClass: "Economy class",
        fareType: "Comfort+",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: "1 piece",
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Extra legroom", "Priority boarding", "Airline miles: at least 3,000"],
        price: 489,
        currency: "US$",
      },
    ],
  },
  {
    id: "dep-4",
    airline: "United Airlines",
    airlineCode: "UA",
    flightNumber: "UA2187",
    cabinClass: "Economy class",
    aircraftType: "Boeing 737-800",
    departureTime: "08:30",
    departureCode: "EWR",
    departureAirport: "Newark Liberty International",
    arrivalTime: "11:45",
    arrivalCode: "MIA",
    arrivalAirport: "Miami International Airport",
    duration: "3h 15m",
    stops: "Nonstop",
    price: 276,
    currency: "US$",
    fareOptions: [
      {
        id: "fare-ua4-basic",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        baggage: {
          personalItem: true,
          carryOn: false,
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        price: 276,
        currency: "US$",
      },
      {
        id: "fare-ua4-economy",
        cabinClass: "Economy class",
        fareType: "Economy",
        recommended: true,
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Seat selection available", "Airline miles: at least 1,800"],
        price: 342,
        currency: "US$",
      },
      {
        id: "fare-ua4-economyplus",
        cabinClass: "Economy class",
        fareType: "Economy Plus",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: "1 piece",
        },
        flexibility: {
          refundable: true,
          changeFee: "Free",
        },
        otherBenefits: ["Extra legroom", "Priority boarding", "Airline miles: at least 2,500"],
        price: 452,
        currency: "US$",
      },
    ],
  },
];

export const returnFlights: FlightData[] = [
  {
    id: "ret-1",
    airline: "American Airlines",
    airlineCode: "AA",
    flightNumber: "AA352",
    cabinClass: "Economy class",
    aircraftType: "Boeing 737 MAX 8",
    departureTime: "20:39",
    departureCode: "MIA",
    departureAirport: "Miami Intl.",
    arrivalTime: "23:45",
    arrivalCode: "LGA B",
    arrivalAirport: "New York LaGuardia B",
    duration: "3h 6m",
    stops: "Nonstop",
    price: 228,
    currency: "US$",
    exclusive: true,
    fareOptions: [
      {
        id: "fare-aa-ret1-basic",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        otherBenefits: ["Airline miles: Eligible"],
        price: 228,
        currency: "US$",
      },
      {
        id: "fare-aa-ret1-tripflex",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        recommended: true,
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        tripFlex: {
          label: "TripFlex · EasyCancel Plus",
          benefits: 4,
          cancellationFee: "Free",
          originalPrice: "US$398",
          note: "* Valid before departure of the first flight. Not transferable to changed flights.",
        },
        otherBenefits: ["Airline miles: Eligible"],
        price: 298,
        currency: "US$",
      },
      {
        id: "fare-aa-ret1-maincabin",
        cabinClass: "Economy class",
        fareType: "Main Cabin",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Seat selection available", "Airline miles: at least 2,002"],
        price: 378,
        currency: "US$",
      },
    ],
  },
  {
    id: "ret-2",
    airline: "Spirit Airlines",
    airlineCode: "NK",
    flightNumber: "NK1523",
    cabinClass: "Economy class",
    aircraftType: "Airbus A320-212",
    departureTime: "14:20",
    departureCode: "MIA",
    departureAirport: "Miami International Airport",
    arrivalTime: "17:35",
    arrivalCode: "EWR",
    arrivalAirport: "Newark Liberty International",
    duration: "3h 15m",
    stops: "Nonstop",
    price: 199,
    currency: "US$",
    fareOptions: [
      {
        id: "fare-nk-ret2-basic",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        baggage: {
          personalItem: true,
          carryOn: false,
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        price: 199,
        currency: "US$",
      },
      {
        id: "fare-nk-ret2-standard",
        cabinClass: "Economy class",
        fareType: "Standard",
        recommended: true,
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Airline miles: Eligible"],
        price: 265,
        currency: "US$",
      },
      {
        id: "fare-nk-ret2-flexi",
        cabinClass: "Economy class",
        fareType: "Flexi",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: "1 piece",
        },
        flexibility: {
          refundable: true,
          changeFee: "Free",
        },
        otherBenefits: ["Seat selection available", "Airline miles: at least 1,500"],
        price: 345,
        currency: "US$",
      },
    ],
  },
  {
    id: "ret-3",
    airline: "Delta Air Lines",
    airlineCode: "DL",
    flightNumber: "DL1782",
    cabinClass: "Economy class",
    aircraftType: "Boeing 737 MAX 8",
    departureTime: "07:45",
    departureCode: "MIA",
    departureAirport: "Miami International Airport",
    arrivalTime: "10:55",
    arrivalCode: "JFK",
    arrivalAirport: "John F. Kennedy International",
    duration: "3h 10m",
    stops: "Nonstop",
    price: 289,
    currency: "US$",
    fareOptions: [
      {
        id: "fare-dl-ret3-basic",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        price: 289,
        currency: "US$",
      },
      {
        id: "fare-dl-ret3-main",
        cabinClass: "Economy class",
        fareType: "Main Cabin",
        recommended: true,
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: "1 piece",
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Seat selection available", "Airline miles: at least 2,200"],
        price: 362,
        currency: "US$",
      },
      {
        id: "fare-dl-ret3-comfort",
        cabinClass: "Economy class",
        fareType: "Comfort+",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: "1 piece",
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Extra legroom", "Priority boarding", "Airline miles: at least 3,000"],
        price: 459,
        currency: "US$",
      },
    ],
  },
  {
    id: "ret-4",
    airline: "United Airlines",
    airlineCode: "UA",
    flightNumber: "UA1245",
    cabinClass: "Economy class",
    aircraftType: "Boeing 737-800",
    departureTime: "16:00",
    departureCode: "MIA",
    departureAirport: "Miami International Airport",
    arrivalTime: "19:20",
    arrivalCode: "EWR",
    arrivalAirport: "Newark Liberty International",
    duration: "3h 20m",
    stops: "Nonstop",
    price: 255,
    currency: "US$",
    fareOptions: [
      {
        id: "fare-ua-ret4-basic",
        cabinClass: "Economy class",
        fareType: "Basic Economy",
        baggage: {
          personalItem: true,
          carryOn: false,
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: false,
        },
        price: 255,
        currency: "US$",
      },
      {
        id: "fare-ua-ret4-economy",
        cabinClass: "Economy class",
        fareType: "Economy",
        recommended: true,
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: false,
        },
        flexibility: {
          refundable: false,
          changeFee: "from US$0",
        },
        otherBenefits: ["Seat selection available", "Airline miles: at least 1,800"],
        price: 318,
        currency: "US$",
      },
      {
        id: "fare-ua-ret4-plus",
        cabinClass: "Economy class",
        fareType: "Economy Plus",
        baggage: {
          personalItem: true,
          carryOn: "1 piece",
          checked: "1 piece",
        },
        flexibility: {
          refundable: true,
          changeFee: "Free",
        },
        otherBenefits: ["Extra legroom", "Priority boarding", "Airline miles: at least 2,500"],
        price: 425,
        currency: "US$",
      },
    ],
  },
];
