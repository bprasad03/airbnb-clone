"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ListingForm from "@/components/ListingForm";
import { api } from "@/lib/api";
import type { ListingDetail } from "@/lib/types";

export default function EditListingPage() {
  const params = useParams();
  const id = Number(params.id);
  const [listing, setListing] = useState<ListingDetail | null>(null);

  useEffect(() => {
    if (id) api.getListing(id).then(setListing).catch(console.error);
  }, [id]);

  if (!listing) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse px-6 py-8">
        <div className="h-8 w-1/2 rounded bg-[#f0f0f0]" />
      </div>
    );
  }

  return (
    <ListingForm
      listingId={id}
      initial={{
        title: listing.title,
        description: listing.description,
        location: listing.location,
        city: listing.city,
        country: listing.country,
        price_per_night: String(listing.price_per_night),
        property_type: listing.property_type,
        max_guests: String(listing.max_guests),
        bedrooms: String(listing.bedrooms),
        beds: String(listing.beds),
        baths: String(listing.baths),
        cleaning_fee: String(listing.cleaning_fee),
        photo_urls: listing.photos.map((p) => p.url).join("\n"),
        amenities: listing.amenities.map((a) => a.name),
      }}
    />
  );
}
