"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ServiceCard from "@/components/ServiceCard";
import { dummyServices } from "@/lib/mockData";

export default function ServicesPage() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);

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
          thirdFieldLabel="Type of service"
        />
      </section>

      <section className="mx-auto max-w-[1760px] px-6 py-10 md:px-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[var(--airbnb-dark)]">Services in Gurgaon District</h2>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {dummyServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
