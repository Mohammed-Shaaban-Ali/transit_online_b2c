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
