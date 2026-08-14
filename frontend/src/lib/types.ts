export interface User {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  is_host: boolean;
  is_superhost: boolean;
}

export interface ListingCard {
  id: number;
  title: string;
  location: string;
  city: string;
  country: string;
  price_per_night: number;
  property_type: string;
  rating: number;
  review_count: number;
  cover_photo: string | null;
  is_wishlisted: boolean;
  badge?: "guest-favourite" | "popular" | "bestseller" | "premium" | "new";
}

export interface ListingDetail extends ListingCard {
  description: string;
  latitude: number;
  longitude: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  cleaning_fee: number;
  service_fee_percent: number;
  host: {
    id: number;
    name: string;
    avatar_url: string | null;
    is_superhost: boolean;
  };
  photos: { id: number; url: string; sort_order: number }[];
  amenities: { id: number; name: string }[];
  created_at: string;
}

export interface PaginatedListings {
  items: ListingCard[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface PriceBreakdown {
  nights: number;
  nightly_rate: number;
  subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  total: number;
}

export interface Availability {
  booked_ranges: { check_in: string; check_out: string }[];
  min_nights: number;
}

export interface Booking {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guests: number;
  nightly_rate: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: string;
  created_at: string;
  listing_title?: string;
  listing_photo?: string;
  listing_location?: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  author: {
    id: number;
    name: string;
    avatar_url: string | null;
    is_superhost: boolean;
  };
}

export interface SearchParams {
  location?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  amenities?: string;
  page?: number;
}
