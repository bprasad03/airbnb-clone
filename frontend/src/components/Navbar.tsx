"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Globe,
  Heart,
  Home,
  Menu,
  User,
  Ticket,
  ConciergeBell
} from "lucide-react";
import { useApp } from "@/context/AppContext";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";

const DEMO_USERS = [
  { id: 1, name: "Priya (Guest)", role: "guest" },
  { id: 2, name: "Rajesh (Host)", role: "host" },
  { id: 3, name: "Ananya (Host)", role: "host" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, userId, setUserId } = useApp();
  const isHostPage = pathname.startsWith("/host");

  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState<Date | undefined>();
  const [checkOut, setCheckOut] = useState<Date | undefined>();
  const [guests, setGuests] = useState(1);

  return (
    <header className="sticky top-0 z-50 border-b border-[#ebebeb] bg-white">
      <div className="relative mx-auto flex h-20 max-w-[1760px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo (3).png" alt="Airbnb" className="h-12 w-auto object-contain" />
        </Link>

        {!isHostPage && (
          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            <Link
              href="/"
              className={`flex items-center gap-2 border-b-[2px] pb-2 pt-2 transition-colors ${
                pathname === "/" 
                  ? "border-[var(--airbnb-dark)] text-[var(--airbnb-dark)] font-bold" 
                  : "border-transparent text-[var(--airbnb-foggy)] font-medium hover:text-[var(--airbnb-dark)] hover:border-[var(--airbnb-light-gray)]"
              }`}
            >
              <span className="text-lg">🌐</span>
              <span className="text-sm">All</span>
            </Link>
            <Link
              href="/homes"
              className={`flex items-center gap-2 border-b-[2px] pb-2 pt-2 transition-colors ${
                pathname === "/homes" 
                  ? "border-[var(--airbnb-dark)] text-[var(--airbnb-dark)] font-bold" 
                  : "border-transparent text-[var(--airbnb-foggy)] font-medium hover:text-[var(--airbnb-dark)] hover:border-[var(--airbnb-light-gray)]"
              }`}
            >
              <span className="text-lg">🏠</span>
              <span className="text-sm">Homes</span>
            </Link>
            <Link
              href="/experiences"
              className={`flex items-center gap-2 border-b-[2px] pb-2 pt-2 transition-colors ${
                pathname === "/experiences" 
                  ? "border-[var(--airbnb-dark)] text-[var(--airbnb-dark)] font-bold" 
                  : "border-transparent text-[var(--airbnb-foggy)] font-medium hover:text-[var(--airbnb-dark)] hover:border-[var(--airbnb-light-gray)]"
              }`}
            >
              <span className="text-lg">🎈</span>
              <span className="text-sm">Experiences</span>
            </Link>
            <Link
              href="/services"
              className={`flex items-center gap-2 border-b-[2px] pb-2 pt-2 transition-colors ${
                pathname === "/services" 
                  ? "border-[var(--airbnb-dark)] text-[var(--airbnb-dark)] font-bold" 
                  : "border-transparent text-[var(--airbnb-foggy)] font-medium hover:text-[var(--airbnb-dark)] hover:border-[var(--airbnb-light-gray)]"
              }`}
            >
              <span className="text-lg">🛎️</span>
              <span className="text-sm">Services</span>
            </Link>
          </nav>
        )}

        {isHostPage && (
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-medium hover:bg-[#f7f7f7]"
          >
            ← Switch to traveling
          </Link>
        )}

        <div className="flex items-center gap-2">
          <Link
            href="/host"
            className="hidden rounded-full px-4 py-3 text-sm font-medium hover:bg-[#f7f7f7] md:block"
          >
            Become a host
          </Link>

          <button
            type="button"
            className="rounded-full p-3 hover:bg-[#f7f7f7]"
            aria-label="Language"
          >
            <Globe className="h-4 w-4" />
          </button>

          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-[#ddd] p-2 pl-3 hover:shadow-md transition-shadow"
            >
              <Menu className="h-4 w-4" />
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#717171] text-white">
                  <User className="h-5 w-5" />
                </div>
              )}
            </button>

            <div className="invisible absolute right-0 top-12 w-56 rounded-xl border border-[#ddd] bg-white py-2 opacity-0 shadow-card transition-all group-hover:visible group-hover:opacity-100">
              <div className="border-b border-[#ebebeb] px-4 py-2">
                <p className="text-xs font-semibold uppercase text-[#717171]">
                  Demo user
                </p>
                {DEMO_USERS.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setUserId(u.id)}
                    className={`mt-1 block w-full rounded-lg px-2 py-1.5 text-left text-sm hover:bg-[#f7f7f7] ${
                      userId === u.id ? "bg-[#f7f7f7] font-semibold" : ""
                    }`}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
              <Link
                href="/trips"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f7f7f7]"
              >
                <Home className="h-4 w-4" /> Trips
              </Link>
              <Link
                href="/wishlist"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f7f7f7]"
              >
                <Heart className="h-4 w-4" /> Wishlists
              </Link>
              <Link
                href="/host"
                className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-[#f7f7f7]"
              >
                Host dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {!isHostPage && (
        <div className="flex justify-center pb-6">
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
        </div>
      )}
    </header>
  );
}
