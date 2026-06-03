export interface IFeaturedDestination {
  id: number;
  auth_user_id: number;
  title: string;
  description: string;
  short_description: string | null;
  category_id: number | null;
  featured_image: string | null;
  active: number;
  seo_title: string | null;
  seo_keywords: string | null;
  seo_image: string | null;
  created_at: string;
  updated_at: string;
}

export interface IFlightOffer {
  id: number;
  from_airport: string;
  to_airport: string;
  departure_date: string;
  return_date: string;
  image: string;
  title: string;
  currency: string;
  price: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface IHotelOffer {
  id: number;
  city_id: number;
  city_name: string;
  hotel_id: number;
  hotel_name: string;
  check_in: string;
  check_out: string;
  rating: number;
  currency: string;
  price: string;
  price_for: string;
  image: string;
}

export interface ITrip {
  id: number;
  title: string;
  description: string;
  img: string | null;
  rate: number | null;
  priority: number | null;
  created_at: string;
  updated_at: string;
}

export interface IMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  from: number;
  to: number;
  total: number;
}

export interface IPaginationResponse<T> {
  data: T[];
  meta: IMeta;
}

export interface IPaginationParams {
  page?: number;
}
