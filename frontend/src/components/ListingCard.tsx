"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/api";
import type { ListingCard } from "@/lib/types";

interface Props {
  listing: ListingCard;
  onWishlistToggle?: (id: number) => void;
}

export default function ListingCardComponent({ listing, onWishlistToggle }: Props) {
  return (
    <Link href={`/listings/${listing.id}`} className="group block">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-[#f7f7f7]">
        {listing.cover_photo ? (
          <img
            src={listing.cover_photo}
            alt={listing.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[#717171]">
            No photo
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onWishlistToggle?.(listing.id);
          }}
          className="absolute right-3 top-3 rounded-full p-1 transition-transform hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-6 w-6 drop-shadow-md ${
              listing.is_wishlisted
                ? "fill-[#ff385c] stroke-[#ff385c]"
                : "fill-black/50 stroke-white"
            }`}
          />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-[#222]">{listing.location}</h3>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <svg viewBox="0 0 32 32" className="h-3 w-3 fill-current">
              <path d="M15.5 2.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" />
            </svg>
            <span>{listing.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="truncate text-[#717171]">{listing.title}</p>
        <p className="truncate text-[#717171]">{listing.property_type}</p>
        <p className="mt-1">
          <span className="font-semibold">{formatPrice(listing.price_per_night)}</span>
          <span className="text-[#222]"> night</span>
        </p>
      </div>
    </Link>
  );
}
