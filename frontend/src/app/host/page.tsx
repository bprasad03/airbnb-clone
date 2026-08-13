"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, Calendar } from "lucide-react";
import { api, formatDate, formatPrice } from "@/lib/api";
import type { Booking, ListingCard } from "@/lib/types";
import { useApp } from "@/context/AppContext";

export default function HostDashboardPage() {
  const { userId, showToast } = useApp();
  const [listings, setListings] = useState<ListingCard[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"listings" | "bookings">("listings");

  useEffect(() => {
    Promise.all([api.getMyListings(), api.getHostBookings()])
      .then(([l, b]) => {
        setListings(l);
        setBookings(b);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this listing?")) return;
    try {
      await api.deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
      showToast("Listing deleted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  return (
    <div className="mx-auto max-w-[1120px] px-6 py-8 md:px-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Host dashboard</h1>
        <Link
          href="/host/listings/new"
          className="flex items-center gap-2 rounded-lg bg-[#222] px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
        >
          <Plus className="h-4 w-4" />
          Create listing
        </Link>
      </div>

      <div className="mb-6 flex gap-4 border-b border-[#ebebeb]">
        <button
          type="button"
          onClick={() => setTab("listings")}
          className={`border-b-2 pb-3 text-sm font-semibold ${
            tab === "listings"
              ? "border-[#222] text-[#222]"
              : "border-transparent text-[#717171]"
          }`}
        >
          Your listings ({listings.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("bookings")}
          className={`border-b-2 pb-3 text-sm font-semibold ${
            tab === "bookings"
              ? "border-[#222] text-[#222]"
              : "border-transparent text-[#717171]"
          }`}
        >
          Bookings ({bookings.length})
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-[#f0f0f0]" />
          ))}
        </div>
      ) : tab === "listings" ? (
        listings.length === 0 ? (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold">You don&apos;t have any listings yet</h2>
            <p className="mt-2 text-[#717171]">
              Create your first listing to start hosting on Airbnb.
            </p>
            <Link
              href="/host/listings/new"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#222] px-6 py-3 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Create listing
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center gap-4 rounded-xl border border-[#ddd] p-4"
              >
                {listing.cover_photo && (
                  <img
                    src={listing.cover_photo}
                    alt={listing.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p className="text-sm text-[#717171]">{listing.location}</p>
                  <p className="text-sm font-semibold">
                    {formatPrice(listing.price_per_night)}/night · ★ {listing.rating}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/host/listings/${listing.id}/edit`}
                    className="rounded-lg border border-[#ddd] p-2 hover:bg-[#f7f7f7]"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(listing.id)}
                    className="rounded-lg border border-[#ddd] p-2 hover:bg-[#fff0f3] hover:text-[#ff385c]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : bookings.length === 0 ? (
        <div className="py-16 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-[#717171]" />
          <h2 className="text-xl font-semibold">No bookings yet</h2>
          <p className="mt-2 text-[#717171]">
            When guests book your listings, they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-xl border border-[#ddd] p-4"
            >
              <p className="text-xs font-semibold uppercase text-[#717171]">
                {booking.status}
              </p>
              <h3 className="mt-1 font-semibold">{booking.listing_title}</h3>
              <p className="text-sm text-[#717171]">
                {formatDate(booking.check_in)} – {formatDate(booking.check_out)} ·{" "}
                {booking.guests} guests
              </p>
              <p className="mt-1 font-semibold">{formatPrice(booking.total_price)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
