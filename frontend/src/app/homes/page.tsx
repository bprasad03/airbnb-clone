"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import { dummyHomes } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";

export default function HomesPage() {
  const { showToast } = useApp();
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);

  const handleWishlist = () => {
    showToast("Updated wishlist");
  };

  return (
    <div>
      <section className="border-b border-[#ebebeb] px-6 py-6 md:px-10">
        <SearchBar
          location={location}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          onLocationChange={setLocation}
          onCheckInChange={setCheckIn}
          onCheckOutChange={setCheckOut}
          onGuestsChange={setGuests}
          onSearch={() => {}}
          onFiltersOpen={() => {}}
        />
      </section>

      <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[var(--airbnb-dark)]">Homes in India</h2>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {dummyHomes.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onWishlistToggle={handleWishlist}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
