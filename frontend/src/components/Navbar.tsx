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

const DEMO_USERS = [
  { id: 1, name: "Priya (Guest)", role: "guest" },
  { id: 2, name: "Rajesh (Host)", role: "host" },
  { id: 3, name: "Ananya (Host)", role: "host" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, userId, setUserId } = useApp();
  const isHostPage = pathname.startsWith("/host");

  return (
    <header className="sticky top-0 z-50 border-b border-[#ebebeb] bg-white">
      <div className="mx-auto flex h-20 max-w-[1760px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-2 text-[var(--airbnb-rausch)]">
          <svg viewBox="0 0 32 32" className="h-8 w-8 fill-current" aria-hidden="true">
            <path d="M16 1c2.008 0 3.463.492 4.671 1.354 1.21.861 2.12 2.1 2.946 3.75l.15.31C25.5 10.262 26 12.337 26 14.5c0 3.328-1.127 6.643-3.327 9.809C20.354 27.65 18.232 31 16 31c-2.232 0-4.354-3.35-6.673-6.691C7.127 21.143 6 17.828 6 14.5c0-2.163.5-4.238 2.233-8.086l.15-.31C9.206 4.453 10.117 3.215 11.329 2.354 12.537 1.492 13.992 1 16 1zm0 2c-1.339 0-2.316.33-3.134.912-.816.58-1.503 1.506-2.186 2.871l-.16.337C8.98 10.51 8.5 12.28 8.5 14.5c0 2.846 1.01 5.748 2.99 8.591C13.513 25.992 15.116 29 16 29c.884 0 2.487-3.008 4.51-5.909 1.98-2.843 2.99-5.745 2.99-8.591 0-2.22-.48-3.99-2.02-7.38l-.16-.337C20.638 5.418 19.951 4.492 19.134 3.912 18.316 3.33 17.339 3 16 3zm0 6c2.205 0 4 1.795 4 4 0 2.206-1.795 4-4 4-2.206 0-4-1.794-4-4 0-2.205 1.794-4 4-4zm0 2c-1.103 0-2 .897-2 2 0 1.103.897 2 2 2 1.103 0 2-.897 2-2 0-1.103-.897-2-2-2z"/>
          </svg>
          <span className="hidden text-2xl font-bold tracking-tight text-[var(--airbnb-rausch)] xl:block">
            airbnb
          </span>
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
    </header>
  );
}
