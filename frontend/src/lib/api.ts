import type {
  Availability,
  Booking,
  ListingCard,
  ListingDetail,
  PaginatedListings,
  PriceBreakdown,
  Review,
  SearchParams,
  User,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

function getUserId(): number {
  if (typeof window === "undefined") return 1;
  return Number(localStorage.getItem("userId") || "1");
}

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "X-User-Id": String(getUserId()),
    ...(options.headers as Record<string, string>),
  };

  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  getCurrentUser: () => fetchApi<User>("/users/me"),

  searchListings: (params: SearchParams) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        query.set(key, String(value));
      }
    });
    return fetchApi<PaginatedListings>(`/listings?${query.toString()}`);
  },

  getCategories: () =>
    fetchApi<{ categories: string[] }>("/listings/categories"),

  getListing: (id: number) => fetchApi<ListingDetail>(`/listings/${id}`),

  getAvailability: (id: number) =>
    fetchApi<Availability>(`/listings/${id}/availability`),

  getPrice: (id: number, checkIn: string, checkOut: string) =>
    fetchApi<PriceBreakdown>(
      `/listings/${id}/price?check_in=${checkIn}&check_out=${checkOut}`
    ),

  getReviews: (id: number) =>
    fetchApi<Review[]>(`/listings/${id}/reviews`),

  createBooking: (data: {
    listing_id: number;
    check_in: string;
    check_out: string;
    guests: number;
  }) =>
    fetchApi<Booking>("/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyTrips: () => fetchApi<Booking[]>("/bookings/my-trips"),

  getHostBookings: () => fetchApi<Booking[]>("/bookings/host"),

  getMyListings: () => fetchApi<ListingCard[]>("/users/me/listings"),

  getWishlist: () => fetchApi<ListingCard[]>("/wishlist"),

  toggleWishlist: (listingId: number) =>
    fetchApi<{ listing_id: number; is_wishlisted: boolean }>(
      `/wishlist/${listingId}`,
      { method: "POST" }
    ),

  createListing: (data: Record<string, unknown>) =>
    fetchApi<ListingDetail>("/listings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateListing: (id: number, data: Record<string, unknown>) =>
    fetchApi<ListingDetail>(`/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteListing: (id: number) =>
    fetchApi<void>(`/listings/${id}`, { method: "DELETE" }),
};

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
