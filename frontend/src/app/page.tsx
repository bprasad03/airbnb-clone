"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import ExperienceCard from "@/components/ExperienceCard";
import ServiceCard from "@/components/ServiceCard";
import { dummyHomes, dummyExperiences, dummyServices } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";

// Create a mixed array
const mixedItems = [
  { type: "home", data: dummyHomes[0] },
  { type: "experience", data: dummyExperiences[0] },
  { type: "service", data: dummyServices[0] },
  { type: "home", data: dummyHomes[1] },
  { type: "home", data: dummyHomes[2] },
  { type: "experience", data: dummyExperiences[1] },
  { type: "service", data: dummyServices[1] },
  { type: "experience", data: dummyExperiences[2] },
  { type: "home", data: dummyHomes[3] },
  { type: "service", data: dummyServices[2] },
];

export default function AllPage() {
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
          <h2 className="text-2xl font-semibold text-[var(--airbnb-dark)]">Explore all</h2>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {mixedItems.map((item, index) => {
            if (item.type === "home") {
              return (
                <ListingCard
                  key={`home-${index}`}
                  // @ts-ignore
                  listing={item.data}
                  onWishlistToggle={handleWishlist}
                />
              );
            }
            if (item.type === "experience") {
              return (
                <ExperienceCard
                  key={`exp-${index}`}
                  // @ts-ignore
                  experience={item.data}
                />
              );
            }
            if (item.type === "service") {
              return (
                <ServiceCard
                  key={`srv-${index}`}
                  // @ts-ignore
                  service={item.data}
                />
              );
            }
            return null;
          })}
        </div>
      </section>
    </div>
  );
}
