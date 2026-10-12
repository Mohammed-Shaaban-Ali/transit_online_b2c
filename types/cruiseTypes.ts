export type CruiseGuestType = "ADT" | "CHD" | "INF";

export type CruiseRegionCode = "RED" | "GULF" | "MED" | "REPO";

export type CruiseGuestQuantity = {
  type: CruiseGuestType;
  quantity: number;
};

export type CruiseSearchFormState = {
  regionPref: CruiseRegionCode | "";
  portCode: string;
  selectedMonths: string[];
  adults: number;
  children: number;
  infants: number;
};

export type CruiseSearchRequest = {
  startDate: string;
  endDate: string;
  guests: CruiseGuestQuantity[];
  regionPref?: CruiseRegionCode;
  portCode?: string;
};

export type CruiseAttributesMap = Record<string, string | null>;

export type CruiseAttributeNode = {
  attributesMap: CruiseAttributesMap;
  textValue?: string;
};

export type CruiseInformation = {
  attributesMap: CruiseAttributesMap;
  text?: {
    attributesMap?: CruiseAttributesMap;
    textValue?: string;
  };
};

export type CruiseSelectedSailing = {
  attributesMap: CruiseAttributesMap;
  cruiseLine: CruiseAttributeNode;
  departurePort: CruiseAttributeNode;
  arrivalPort: CruiseAttributeNode;
  region: {
    attributesMap: CruiseAttributesMap;
  };
};

export type CruiseSailingOption = {
  attributesMap: CruiseAttributesMap;
  selectedSailing: CruiseSelectedSailing;
  inclusivePackageOption: CruiseAttributeNode;
  currency: CruiseAttributeNode;
  informations: CruiseInformation[];
};

export type CruiseSearchResponse = {
  success: boolean;
  warnings?: string[];
  data: {
    sailingOptions: CruiseSailingOption[];
  };
};

export type CruiseRegionOption = {
  code: CruiseRegionCode | "";
  labelKey: string;
};

export type CruisePortOption = {
  code: string;
  labelKey: string;
};

export type CruiseDateTimeQualifier = "arrival" | "departure" | "stay" | string;

export type CruiseDateTimeDescription = {
  attributesMap: {
    dateTimeQualifier?: CruiseDateTimeQualifier | null;
    dateTimeDetails?: string | null;
    dayOfWeek?: string | null;
  };
};

export type CruiseItinInfo = {
  attributesMap: {
    portCode?: string | null;
    portName?: string | null;
    portCountryCode?: string | null;
    dockIndicator?: string | null;
    shorexIndicator?: string | null;
  };
  dateTimeDescriptions: CruiseDateTimeDescription[];
};

export type CruiseItinerarySelectedSailing = {
  attributesMap: {
    voyageId?: string | null;
    start?: string | null;
    end?: string | null;
    duration?: string | null;
    shipCode?: string | null;
    shipName?: string | null;
  };
};

export type CruiseItineraryRequest = {
  voyageId: string;
};

export type CruiseItineraryResponse = {
  success: boolean;
  warnings?: string[];
  data: {
    selectedSailing: CruiseItinerarySelectedSailing;
    cruiseItinInfos: CruiseItinInfo[];
  };
};

export type CruiseTimelineDay = {
  id: string;
  date: string;
  dayOfWeek: string;
  kind: "port" | "sea";
  portCode?: string;
  portName?: string;
  arrivalTime?: string;
  departureTime?: string;
  hasShorex?: boolean;
};

export type CruiseCabinGuestSlot = {
  id: string;
  type: CruiseGuestType;
  index: number;
  cabinIndex: number;
};

export type CruiseCategoriesCabinRequest = {
  guests: CruiseGuestQuantity[];
};

export type CruiseCategoriesRequest = {
  voyageId: string;
  shipCode: string;
  fareCode: string;
  cabins: CruiseCategoriesCabinRequest[];
};

export type CruiseCategoryPriceInfo = {
  attributesMap: {
    breakdownType?: string | null;
    amount?: string | null;
    currencyCode?: string | null;
    chargeTypeCode?: string | null;
  };
};

export type CruiseCategoryContent = {
  name?: string | null;
  description?: string | null;
  amenities?: string[];
  imageUrls?: string[];
} | null;

export type CruiseCategoryOption = {
  attributesMap: {
    pricedCategoryCode?: string | null;
    genericCategoryCode?: string | null;
    maxOccupancy?: string | null;
    status?: string | null;
    listOfCategoryQualifierCodes?: string | null;
  };
  priceInfos: CruiseCategoryPriceInfo[];
  content: CruiseCategoryContent;
};

export type CruiseCabinCategoriesResult = {
  sailingInfo?: {
    selectedSailing?: CruiseSelectedSailing | CruiseItinerarySelectedSailing;
    currency?: CruiseAttributeNode;
  };
  fareOption: {
    attributesMap: {
      fareCode?: string | null;
    };
    categoryOptions: CruiseCategoryOption[];
  };
};

export type CruiseCategoriesResponse = {
  success: boolean;
  data: CruiseCabinCategoriesResult[];
};

export type CruiseCabinsMultipleCategoryRequest = {
  categoryCode: string;
  guests: CruiseGuestQuantity[];
  deckNumber?: number;
  cabinAttributeCode?: number;
  maxResponses?: number;
};

export type CruiseCabinsMultipleRequest = {
  voyageId: string;
  categories: CruiseCabinsMultipleCategoryRequest[];
};

export type CruiseCabinOption = {
  attributesMap: {
    cabinNumber?: string | null;
    deckNumber?: string | null;
    cabinCategoryCode?: string | null;
    cabinCategoryStatusCode?: string | null;
    cabinRanking?: string | null;
    maxOccupancy?: string | null;
    status?: string | null;
    shipSide?: string | null;
    positionInShip?: string | null;
    bedType?: string | null;
    declineIndicator?: string | null;
    heldIndicator?: string | null;
  };
  remark?: {
    textValue?: string | null;
  } | null;
  cabinFilters?: {
    attributesMap?: {
      cabinFilterCode?: string | null;
    };
  }[];
  priceInfos?: CruiseCategoryPriceInfo[];
  content?: CruiseCategoryContent;
};

export type CruiseCabinsMultipleResult = {
  sailingInfo?: {
    selectedSailing?: CruiseSelectedSailing | CruiseItinerarySelectedSailing;
    currency?: CruiseAttributeNode;
    selectedCategory?: {
      attributesMap?: {
        pricedCategoryCode?: string | null;
      };
    };
  };
  selectedFare?: {
    attributesMap?: {
      fareCode?: string | null;
    };
  };
  cabinOptions: CruiseCabinOption[];
};

export type CruiseCabinsMultipleResponse = {
  success: boolean;
  data: CruiseCabinsMultipleResult[];
};

export type CruiseSelectedCabinCategory = {
  code: string;
  name: string;
  badge: string;
  maxOccupancy?: number;
  amount?: number;
};

export type CruiseBookCabinRequest = {
  categoryCode: string;
  cabinNumber: string;
  guestRefNumbers: number[];
};

export type CruiseBookGuestRequest = {
  guestRefNumber: number;
  gender: "Male" | "Female";
  birthDate: string;
  nationality: string;
  givenName: string;
  surname: string;
};

export type CruiseBookContactInfo = {
  name: string;
  email: string;
  phone: string;
  country_calling_code: string;
};

export type CruiseBookRequest = {
  voyageId: string;
  cabins: CruiseBookCabinRequest[];
  guests: CruiseBookGuestRequest[];
  contactInfo: CruiseBookContactInfo;
  paymentGateway: string;
  redirectUrl: string;
  couponCode?: string;
  profit?: number;
};

export type CruiseBookResponse = {
  success?: boolean;
  status?: boolean;
  message?: string | null;
  bookingId?: number | string | null;
  bookingReference?: number | string | null;
  redirectUrl?: string | null;
  price?: number | null;
};

export type CruiseBookingDetailsResponse = {
  success: boolean;
  message?: string | null;
  data?: Record<string, unknown> | null;
};
