"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { api, formatDate, formatPrice } from "@/lib/api";
import type { Booking } from "@/lib/types";

export default function BookingConfirmationPage() {
  const params = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    api
      .getMyTrips()
      .then((trips) => {
        const found = trips.find((t) => t.id === Number(params.id));
        setBooking(found || null);
      })
      .catch(console.error);
  }, [params.id]);

  if (!booking) {
    return (
      <div className="mx-auto max-w-lg animate-pulse px-6 py-16">
        <div className="h-64 rounded-xl bg-[#f0f0f0]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <CheckCircle className="mx-auto mb-6 h-16 w-16 text-[#008a05]" />
      <h1 className="text-3xl font-semibold">Booking confirmed!</h1>
      <p className="mt-2 text-[#717171]">
        Your reservation is confirmed. This is a mock checkout — no payment was processed.
      </p>

      <div className="mt-8 rounded-xl border border-[#ddd] p-6 text-left">
        <h2 className="text-lg font-semibold">{booking.listing_title}</h2>
        <p className="mt-1 text-sm text-[#717171]">{booking.listing_location}</p>
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="font-semibold">Check-in:</span> {formatDate(booking.check_in)}
          </p>
          <p>
            <span className="font-semibold">Check-out:</span> {formatDate(booking.check_out)}
          </p>
          <p>
            <span className="font-semibold">Guests:</span> {booking.guests}
          </p>
          <p className="border-t border-[#ebebeb] pt-3 text-lg font-semibold">
            Total: {formatPrice(booking.total_price)}
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/trips"
          className="rounded-lg bg-[#222] px-6 py-3 text-sm font-semibold text-white"
        >
          View my trips
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-[#222] px-6 py-3 text-sm font-semibold"
        >
          Back to explore
        </Link>
      </div>
    </div>
  );
}
