export interface searchHotelsParams {
  country: string;
  checkIn: string;
  checkOut: string;
  location: {
    latitude: number;
    longitude: number;
  };
  radiusInMeters: number;
  rooms: {
    AdultsCount: number;
    KidsAges: number[];
  }[];
}

export interface hotelSeachTypes {
  id: string;
  displayName: string;
  displayNameAr: string;
  address: string;
  starRating: number | string;
  price: string | number;
  defaultImage?: {
    FullSize?: string;
  };
  description?: string;
  locationDetails?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  facilities?: Array<{
    name?: string;
    id?: string;
  }>;
  propertyTypeId?: string;
  propertyType?: {
    id?: string;
    name?: string;
  };
  chainId?: string;
  chain?: {
    id?: string;
    name?: string;
  };
  nights?: number;
  adults?: number;
  children?: number;
}

export interface HotelFilters {
  propertyTypes: { id: string; text: string; count: string }[];
  chains: { id: string; text: string; count: string }[];
  facilities: { id: string; text: string; count: string }[];
}

export interface SearchHotelsResponse {
  errors: [];
  data: hotelSeachTypes[];
  searchId: string;
  uuid: string;
  filters: HotelFilters;
}

// Hotel Details Types
export interface ITaxAndFee {
  Currency: string;
  FeeTitle: string;
  FrequencyType: string;
  IsIncludedInPrice: boolean;
  IsMandatory: boolean;
  UnitType: string;
  Value: string;
}

export interface IPrice {
  currency: string;
  finalPrice: number;
  finalPriceInSupplierCurrency: number;
  originalPrice: number;
  originalPriceInSupplierCurrency: number;
  supplierCurrency: string;
  taxesAndFees: ITaxAndFee[];
}

export interface ISupplier {
  id: number;
  name: string;
}

export interface IPackageRoom {
  adultsCount: number;
  availability: string;
  id: string;
  kidsAges: number[];
  price: IPrice;
  roomBasisCode: string;
  roomBasis: string;
  roomClass: string;
  roomName: string;
  roomType: string;
  specialDeals: unknown[];
  targetRoomKey: string;
  images: string[];
  descriptions: string[];
}

export interface IPackage {
  contractId: number;
  hotelId: number;
  packageId: string;
  price: IPrice;
  refundability: number;
  refundabilityNew: boolean;
  refundableUntil: string;
  refundableText: string;
  remarks: string[];
  rooms: IPackageRoom[];
  simplePrice: number;
  supplier: ISupplier;
  images: string[];
  description: string;
}

export interface IRoomKey {
  Amenities: string[];
  Descriptions: string[];
  Images: string[];
  RoomKey: string;
  RoomMaxOccupancy: number;
  RoomSizeSqm: number;
  HasBalcony?: boolean;
  RoomView?: string[];
  NumberOfBedrooms?: number;
}

export interface IRoomsContent {
  rooms: {
    RoomKey: IRoomKey;
  }[];
}

export interface IHotelDescription {
  title: string;
  description: string;
  language: string;
  line: number;
}

export interface IHotelFacility {
  facility: string;
  facilityIcon: string;
  facilityType: string;
}

export interface IHotelContent {
  descriptions: IHotelDescription[];
  facilities: IHotelFacility[];
  images: string[];
}

export interface IHotelDetails {
  errors: unknown[];
  packages: IPackage[];
  roomsContent: IRoomsContent;
  uuid: string;
  hotelContent: IHotelContent;
}

// Book Hotel Types
export interface Guest {
  name?: string;
  type?: number;
  passport_number?: string;
  passport_country?: string;
  nationality?: string;
  issue_date?: string;
  expiry_date?: string;
  birth_date?: string;
}

export interface HotelRoom {
  room_pax?: number;
  room_board?: string;
  adult?: number;
  child?: number;
}

export interface Hotel {
  checkIn: string;
  checkOut: string;
  hotel_id: number;
  buy_currency_id: number;
  buy_price: number;
  sell_currency_id: number;
  sell_price: number;

  // supplier_id?: number;
  rooms: HotelRoom[];
}

export interface bookHotelRequest {
  title: string;
  client_type: string;
  client: number;
  // email: string;
  // phone: string;
  // adults: number;
  // children: number;
  // infants: number;
  // terms: string;
  // notes: string;
  // guests?: Guest[];
  hotels: Hotel[];
  flights?: any[]; // Flight booking data
}
