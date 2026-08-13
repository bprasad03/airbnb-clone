"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DateRangePicker from "./DateRangePicker";
import { api, formatPrice } from "@/lib/api";
import type { Availability, ListingDetail, PriceBreakdown } from "@/lib/types";
import { useApp } from "@/context/AppContext";

interface Props {
  listing: ListingDetail;
}

export default function BookingWidget({ listing }: Props) {
  const router = useRouter();
  const { showToast } = useApp();
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [price, setPrice] = useState<PriceBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getAvailability(listing.id).then(setAvailability).catch(console.error);
  }, [listing.id]);

  useEffect(() => {
    if (checkIn && checkOut && checkOut > checkIn) {
      api
        .getPrice(
          listing.id,
          format(checkIn, "yyyy-MM-dd"),
          format(checkOut, "yyyy-MM-dd")
        )
        .then(setPrice)
        .catch(() => setPrice(null));
    } else {
      setPrice(null);
    }
  }, [checkIn, checkOut, listing.id]);

  const bookedRanges =
    availability?.booked_ranges.map((r) => ({
      from: new Date(r.check_in),
      to: new Date(r.check_out),
    })) || [];

  const handleReserve = async () => {
    if (!checkIn || !checkOut) {
      showToast("Please select check-in and check-out dates", "error");
      return;
    }
    if (guests > listing.max_guests) {
      showToast(`Maximum ${listing.max_guests} guests allowed`, "error");
      return;
    }

    setLoading(true);
    try {
      const booking = await api.createBooking({
        listing_id: listing.id,
        check_in: format(checkIn, "yyyy-MM-dd"),
        check_out: format(checkOut, "yyyy-MM-dd"),
        guests,
      });
      router.push(`/booking/confirmation/${booking.id}`);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Booking failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[#ddd] p-6 shadow-card">
      <div className="mb-4 flex items-baseline gap-1">
        <span className="text-2xl font-semibold">
          {formatPrice(listing.price_per_night)}
        </span>
        <span className="text-[#717171]">night</span>
      </div>

      <div className="relative mb-4 overflow-hidden rounded-lg border border-[#222]">
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="grid w-full grid-cols-2"
        >
          <div className="border-r border-[#222] p-3 text-left">
            <div className="text-[10px] font-bold uppercase">Check-in</div>
            <div className="text-sm">
              {checkIn ? format(checkIn, "MM/dd/yyyy") : "Add date"}
            </div>
          </div>
          <div className="p-3 text-left">
            <div className="text-[10px] font-bold uppercase">Checkout</div>
            <div className="text-sm">
              {checkOut ? format(checkOut, "MM/dd/yyyy") : "Add date"}
            </div>
          </div>
        </button>
        <div className="border-t border-[#222] p-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase">Guests</div>
              <div className="text-sm">{guests} guest{guests > 1 ? "s" : ""}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={guests <= 1}
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full border disabled:opacity-30"
              >
                −
              </button>
              <button
                type="button"
                disabled={guests >= listing.max_guests}
                onClick={() => setGuests(guests + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {showCalendar && (
          <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl border border-[#ddd] bg-white p-4 shadow-card">
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              onCheckInChange={setCheckIn}
              onCheckOutChange={setCheckOut}
              bookedRanges={bookedRanges}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleReserve}
        disabled={loading}
        className="w-full rounded-lg bg-gradient-to-r from-[#e61e4d] to-[#e31c5f] py-3.5 text-base font-semibold text-white hover:from-[#d70466] hover:to-[#bd1e59] disabled:opacity-60"
      >
        {loading ? "Reserving..." : "Reserve"}
      </button>
      <p className="mt-3 text-center text-sm text-[#717171]">
        You won&apos;t be charged yet
      </p>

      {price && (
        <div className="mt-6 space-y-3 border-t border-[#ebebeb] pt-4 text-[#222]">
          <div className="flex justify-between">
            <span className="underline">
              {formatPrice(price.nightly_rate)} × {price.nights} nights
            </span>
            <span>{formatPrice(price.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>{formatPrice(price.cleaning_fee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Service fee</span>
            <span>{formatPrice(price.service_fee)}</span>
          </div>
          <div className="flex justify-between border-t border-[#ebebeb] pt-3 font-semibold">
            <span>Total</span>
            <span>{formatPrice(price.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
