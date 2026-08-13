"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { api, formatDate, formatPrice } from "@/lib/api";
import type { Booking } from "@/lib/types";
import { useApp } from "@/context/AppContext";

export default function TripsPage() {
  const { userId } = useApp();
  const [trips, setTrips] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getMyTrips()
      .then(setTrips)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-8 md:px-10">
      <h1 className="mb-8 text-3xl font-semibold">Trips</h1>

      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-[#f0f0f0]" />
          ))}
        </div>
      ) : trips.length === 0 ? (
        <div className="py-16 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-[#717171]" />
          <h2 className="text-xl font-semibold">No trips booked... yet!</h2>
          <p className="mt-2 text-[#717171]">
            Time to dust off your bags and start planning your next adventure.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[#222] px-6 py-3 text-sm font-semibold text-white"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="flex flex-col gap-4 rounded-xl border border-[#ddd] p-4 sm:flex-row"
            >
              {trip.listing_photo && (
                <img
                  src={trip.listing_photo}
                  alt={trip.listing_title}
                  className="h-40 w-full rounded-lg object-cover sm:w-48"
                />
              )}
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase text-[#717171]">
                  {trip.status}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{trip.listing_title}</h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-[#717171]">
                  <MapPin className="h-4 w-4" />
                  {trip.listing_location}
                </p>
                <p className="mt-2 text-sm">
                  {formatDate(trip.check_in)} – {formatDate(trip.check_out)} ·{" "}
                  {trip.guests} guest{trip.guests > 1 ? "s" : ""}
                </p>
                <p className="mt-2 font-semibold">{formatPrice(trip.total_price)} total</p>
              </div>
              <Link
                href={`/listings/${trip.listing_id}`}
                className="self-start rounded-lg border border-[#222] px-4 py-2 text-sm font-semibold hover:bg-[#f7f7f7]"
              >
                View listing
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
