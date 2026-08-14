"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/api";
import type { ListingCard } from "@/lib/types";
import Badge from "./Badge";
import { useApp } from "@/context/AppContext";

interface Props {
  listing: ListingCard;
}

export default function ListingCardComponent({ listing }: Props) {
  const { wishlistIds, toggleWishlist } = useApp();
  const isWishlisted = wishlistIds.includes(String(listing.id));

  return (
    <Link href={`/listing/${listing.id}`} className="group block">
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
        {listing.badge && (
          <div className="absolute left-3 top-3">
            <Badge type={listing.badge} />
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(String(listing.id));
          }}
          className="absolute right-3 top-3 rounded-full p-1 transition-transform hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-6 w-6 drop-shadow-md ${
              isWishlisted
                ? "fill-[#ff385c] stroke-[#ff385c]"
                : "fill-black/50 stroke-white"
            }`}
          />
        </button>
      </div>

      <div className="mt-3 space-y-0.5">
        <h3 className="truncate text-[15px] font-medium text-[#222]">{listing.title}</h3>
        <div className="truncate text-[12px] text-[#717171]">
          {formatPrice(listing.price_per_night)} for 2 nights <span className="mx-1">·</span> ★ {listing.rating.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
