"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Heart, MapPin, Share, Star } from "lucide-react";
import PhotoGallery from "@/components/PhotoGallery";
import BookingWidget from "@/components/BookingWidget";
import { api, formatDate } from "@/lib/api";
import type { ListingDetail, Review } from "@/lib/types";
import { useApp } from "@/context/AppContext";

export default function ListingDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { showToast, userId } = useApp();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([api.getListing(id), api.getReviews(id)])
      .then(([l, r]) => {
        setListing(l);
        setReviews(r);
      })
      .catch(() => showToast("Failed to load listing", "error"))
      .finally(() => setLoading(false));
  }, [id, userId, showToast]);

  const toggleWishlist = async () => {
    if (!listing) return;
    try {
      const result = await api.toggleWishlist(listing.id);
      setListing({ ...listing, is_wishlisted: result.is_wishlisted });
      showToast(result.is_wishlisted ? "Saved to wishlist" : "Removed from wishlist");
    } catch {
      showToast("Failed to update wishlist", "error");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1120px] animate-pulse px-6 py-8">
        <div className="mb-6 h-8 w-2/3 rounded bg-[#f0f0f0]" />
        <div className="mb-8 h-[480px] rounded-xl bg-[#f0f0f0]" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-semibold">Listing not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-6 md:px-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold md:text-3xl">{listing.title}</h1>
        <div className="flex shrink-0 gap-4">
          <button type="button" className="flex items-center gap-2 text-sm font-semibold underline">
            <Share className="h-4 w-4" /> Share
          </button>
          <button
            type="button"
            onClick={toggleWishlist}
            className="flex items-center gap-2 text-sm font-semibold underline"
          >
            <Heart
              className={`h-4 w-4 ${listing.is_wishlisted ? "fill-[#ff385c] stroke-[#ff385c]" : ""}`}
            />
            Save
          </button>
        </div>
      </div>

      <PhotoGallery photos={listing.photos} title={listing.title} />

      <div className="mt-8 grid gap-12 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="border-b border-[#ebebeb] pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {listing.property_type} hosted by {listing.host.name}
                </h2>
                <p className="text-[#717171]">
                  {listing.max_guests} guests · {listing.bedrooms} bedrooms ·{" "}
                  {listing.beds} beds · {listing.baths} baths
                </p>
              </div>
              {listing.host.avatar_url && (
                <div className="relative">
                  <img
                    src={listing.host.avatar_url}
                    alt={listing.host.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  {listing.host.is_superhost && (
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-[#222] p-1">
                      <Star className="h-3 w-3 fill-white text-white" />
                    </span>
                  )}
                </div>
              )}
            </div>
            {listing.host.is_superhost && (
              <p className="mt-2 text-sm">
                <span className="font-semibold">{listing.host.name}</span> is a Superhost
              </p>
            )}
          </div>

          <div className="border-b border-[#ebebeb] py-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{listing.rating.toFixed(2)}</span>
              <span className="text-[#717171]">· {listing.review_count} reviews</span>
            </div>
            <p className="mt-4 leading-relaxed text-[#222]">{listing.description}</p>
          </div>

          <div className="border-b border-[#ebebeb] py-6">
            <h3 className="mb-4 text-xl font-semibold">What this place offers</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {listing.amenities.map((a) => (
                <div key={a.id} className="flex items-center gap-3 text-[#222]">
                  <span className="h-2 w-2 rounded-full bg-[#222]" />
                  {a.name}
                </div>
              ))}
            </div>
          </div>

          <div className="border-b border-[#ebebeb] py-6">
            <h3 className="mb-4 text-xl font-semibold">Where you&apos;ll be</h3>
            <p className="mb-4 flex items-center gap-2 text-[#717171]">
              <MapPin className="h-4 w-4" />
              {listing.location}, {listing.city}, {listing.country}
            </p>
            <div className="overflow-hidden rounded-xl border border-[#ddd]">
              <img
                src={`https://maps.googleapis.com/maps/api/staticmap?center=${listing.latitude},${listing.longitude}&zoom=12&size=600x300&maptype=roadmap&markers=color:red%7C${listing.latitude},${listing.longitude}&key=`}
                alt="Map"
                className="h-[300px] w-full bg-[#e8f4ea] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800";
                }}
              />
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="py-6">
              <h3 className="mb-6 text-xl font-semibold">
                <Star className="mr-1 inline h-5 w-5 fill-current" />
                {listing.rating.toFixed(2)} · {reviews.length} reviews
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {reviews.map((review) => (
                  <div key={review.id}>
                    <div className="mb-2 flex items-center gap-3">
                      {review.author.avatar_url && (
                        <img
                          src={review.author.avatar_url}
                          alt={review.author.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{review.author.name}</p>
                        <p className="text-sm text-[#717171]">
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="mb-1 flex">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-current" />
                      ))}
                    </div>
                    <p className="text-[#222]">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <BookingWidget listing={listing} />
        </div>
      </div>
    </div>
  );
}
