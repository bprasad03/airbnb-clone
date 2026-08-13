"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import { api } from "@/lib/api";
import type { ListingCard as ListingCardType } from "@/lib/types";
import { useApp } from "@/context/AppContext";

export default function WishlistPage() {
  const { showToast, userId } = useApp();
  const [items, setItems] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getWishlist()
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleWishlist = async (id: number) => {
    try {
      await api.toggleWishlist(id);
      setItems((prev) => prev.filter((l) => l.id !== id));
      showToast("Removed from wishlist");
    } catch {
      showToast("Failed to update wishlist", "error");
    }
  };

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10">
      <h1 className="mb-8 text-3xl font-semibold">Wishlists</h1>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-[#f0f0f0]" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-[#717171]" />
          <h2 className="text-xl font-semibold">Create your first wishlist</h2>
          <p className="mt-2 text-[#717171]">
            As you search, tap the heart icon to save your favorite places.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[#222] px-6 py-3 text-sm font-semibold text-white"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onWishlistToggle={handleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
