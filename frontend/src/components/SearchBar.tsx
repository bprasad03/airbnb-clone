"use client";

import { format } from "date-fns";
import { Search, MapPin, Navigation, Minus, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import DateRangePicker from "./DateRangePicker";

interface Props {
  location: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  guests: number;
  onLocationChange: (v: string) => void;
  onCheckInChange: (d: Date | undefined) => void;
  onCheckOutChange: (d: Date | undefined) => void;
  onGuestsChange: (n: number) => void;
  onSearch: () => void;
  onFiltersOpen: () => void;
  compact?: boolean;
  thirdFieldLabel?: string;
}

type PanelType = "where" | "when" | "who" | null;

const ALL_DESTINATIONS = [
  { title: "Chandigarh", subtitle: "Near you" },
  { title: "Zirakpur, Punjab", subtitle: "A hidden gem" },
  { title: "Kasauli, Himachal Pradesh", subtitle: "For nature lovers" },
  { title: "Dehradun, Uttarakhand", subtitle: "For nature lovers" },
  { title: "North Goa, Goa", subtitle: "Popular beach destination" },
  { title: "Kharar, Punjab", subtitle: "Near you" },
];

export default function SearchBar({
  location,
  checkIn,
  checkOut,
  guests,
  onLocationChange,
  onCheckInChange,
  onCheckOutChange,
  onGuestsChange,
  onSearch,
  onFiltersOpen,
  compact = false,
  thirdFieldLabel = "Who",
}: Props) {
  const [activePanel, setActivePanel] = useState<PanelType>(null);
  const [whenTab, setWhenTab] = useState<"dates" | "flexible">("dates");
  
  // Who dropdown state
  const [adults, setAdults] = useState(guests > 0 ? guests : 0);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePanel(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Update total guests when adults or children change
  useEffect(() => {
    const total = adults + children;
    if (total !== guests && total > 0) {
      onGuestsChange(total);
    }
  }, [adults, children, guests, onGuestsChange]);

  const filteredDestinations = ALL_DESTINATIONS.filter((d) => 
    d.title.toLowerCase().includes(location.toLowerCase())
  );

  if (compact) {
    return (
      <button
        type="button"
        onClick={onSearch}
        className="flex w-full items-center gap-3 rounded-full border border-[#ddd] px-6 py-3 shadow-search hover:shadow-md transition-shadow"
      >
        <Search className="h-4 w-4" />
        <span className="truncate text-sm font-medium">
          {location || "Anywhere"} ·{" "}
          {checkIn ? format(checkIn, "MMM d") : "Any week"} · {guests} guest
          {guests > 1 ? "s" : ""}
        </span>
      </button>
    );
  }

  return (
    <div className="relative mx-auto max-w-[850px]" ref={containerRef}>
      <div className="flex h-16 items-center rounded-full border border-[var(--airbnb-light-gray)] bg-white shadow-search">
        {/* WHERE */}
        <div 
          onClick={() => setActivePanel("where")}
          className={`flex h-full flex-[1.2] flex-col justify-center rounded-full pl-8 pr-6 transition-colors cursor-pointer relative 
          ${activePanel === "where" ? "bg-white shadow-[0_6px_20px_rgba(0,0,0,0.2)] z-10" : "hover:bg-gray-100"} 
          ${activePanel === "where" ? "" : "after:absolute after:right-0 after:top-1/2 after:h-8 after:-translate-y-1/2 after:border-r after:border-[var(--airbnb-light-gray)] hover:after:hidden focus-within:after:hidden"}`}
        >
          <label className="block text-xs font-bold text-[var(--airbnb-dark)]">Where</label>
          <input
            type="text"
            placeholder="Search destinations"
            value={location}
            onChange={(e) => {
              onLocationChange(e.target.value);
              setActivePanel("where");
            }}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--airbnb-foggy)]"
          />
        </div>

        {/* WHEN */}
        <button
          type="button"
          onClick={() => setActivePanel(activePanel === "when" ? null : "when")}
          className={`flex h-full flex-[2] flex-col justify-center px-6 transition-colors text-left rounded-full relative 
          ${activePanel === "when" ? "bg-white shadow-[0_6px_20px_rgba(0,0,0,0.2)] z-10" : "hover:bg-gray-100"} 
          ${activePanel === "when" ? "" : "after:absolute after:right-0 after:top-1/2 after:h-8 after:-translate-y-1/2 after:border-r after:border-[var(--airbnb-light-gray)] hover:after:hidden focus-within:after:hidden"}`}
        >
          <span className="block text-xs font-bold text-[var(--airbnb-dark)]">When</span>
          <span className="text-sm text-[var(--airbnb-foggy)] truncate">
            {checkIn && checkOut 
              ? `${format(checkIn, "MMM d")} - ${format(checkOut, "MMM d")}` 
              : (checkIn ? format(checkIn, "MMM d") : (whenTab === "flexible" ? "Anytime" : "Add dates"))}
          </span>
        </button>

        {/* WHO */}
        <div 
          onClick={() => setActivePanel(activePanel === "who" ? null : "who")}
          className={`flex h-full flex-[1.3] items-center justify-between pl-6 pr-2 rounded-full transition-colors cursor-pointer relative
          ${activePanel === "who" ? "bg-white shadow-[0_6px_20px_rgba(0,0,0,0.2)] z-10" : "hover:bg-gray-100"}`}
        >
          <div className="text-left flex-1 flex flex-col justify-center h-full truncate pr-2">
            <span className="block text-xs font-bold text-[var(--airbnb-dark)]">{thirdFieldLabel}</span>
            <span className={`text-sm truncate ${guests > 1 ? "text-[var(--airbnb-dark)] font-medium" : "text-[var(--airbnb-foggy)]"}`}>
              {thirdFieldLabel === "Who" ? (guests > 0 ? `${guests} guests` : "Add guests") : "Add service type"}
            </span>
          </div>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSearch();
            }}
            className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[var(--airbnb-primary)] text-white hover:opacity-90 transition-opacity"
            aria-label="Search"
          >
            <Search className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* DROPDOWN PANELS */}
      {activePanel === "where" && (
        <div className="absolute left-0 top-full z-50 mt-4 w-[400px] rounded-3xl border border-[#ddd] bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
          <h3 className="text-xs font-bold uppercase text-[var(--airbnb-dark)] mb-4">Suggested destinations</h3>
          <ul className="max-h-[360px] overflow-y-auto space-y-4">
            <li className="flex items-center gap-4 cursor-pointer group" onClick={() => { onLocationChange("Nearby"); setActivePanel(null); }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500 group-hover:bg-gray-200">
                <Navigation className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold text-[var(--airbnb-dark)]">Nearby</p>
                <p className="text-sm text-[var(--airbnb-foggy)]">Find what's around you</p>
              </div>
            </li>
            {filteredDestinations.map((dest, idx) => (
              <li key={idx} className="flex items-center gap-4 cursor-pointer group" onClick={() => { onLocationChange(dest.title); setActivePanel(null); }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500 group-hover:bg-gray-200">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--airbnb-dark)]">{dest.title}</p>
                  <p className="text-sm text-[var(--airbnb-foggy)]">{dest.subtitle}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activePanel === "when" && (
        <div className="absolute left-1/2 top-full z-50 mt-4 -translate-x-1/2 w-[800px] rounded-3xl border border-[#ddd] bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
          <div className="flex justify-center mb-6">
            <div className="flex items-center rounded-full bg-gray-100 p-1">
              <button 
                onClick={() => setWhenTab("dates")}
                className={`rounded-full px-6 py-1.5 text-sm font-semibold transition-colors ${whenTab === "dates" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-800"}`}
              >
                Dates
              </button>
              <button 
                onClick={() => setWhenTab("flexible")}
                className={`rounded-full px-6 py-1.5 text-sm font-semibold transition-colors ${whenTab === "flexible" ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-800"}`}
              >
                Flexible
              </button>
            </div>
          </div>
          
          {whenTab === "dates" && (
            <>
              <div className="flex justify-center">
                <DateRangePicker
                  checkIn={checkIn}
                  checkOut={checkOut}
                  onCheckInChange={onCheckInChange}
                  onCheckOutChange={(d) => {
                    onCheckOutChange(d);
                    if (d) setActivePanel("who");
                  }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                <button className="rounded-full border border-black bg-white px-4 py-2 text-sm font-medium">Exact dates</button>
                <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:border-black">± 1 day</button>
                <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:border-black">± 2 days</button>
                <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:border-black">± 3 days</button>
                <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:border-black">± 7 days</button>
                <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium hover:border-black">± 14 days</button>
              </div>
            </>
          )}

          {whenTab === "flexible" && (
            <div className="py-4 text-center">
              <h3 className="text-lg font-semibold mb-4">How long would you like to stay?</h3>
              <div className="flex justify-center gap-3 mb-8">
                <button className="rounded-full border border-gray-200 px-6 py-2 hover:border-black text-sm">Weekend</button>
                <button className="rounded-full border border-gray-200 px-6 py-2 hover:border-black text-sm">Week</button>
                <button className="rounded-full border border-gray-200 px-6 py-2 hover:border-black text-sm">Month</button>
              </div>

              <h3 className="text-lg font-semibold mb-4">When do you want to go?</h3>
              <div className="flex gap-4 overflow-x-auto justify-center pb-4 max-w-[650px] mx-auto">
                {[
                  { month: "August", year: "2026" },
                  { month: "September", year: "2026" },
                  { month: "October", year: "2026" },
                  { month: "November", year: "2026" },
                  { month: "December", year: "2026" },
                  { month: "January", year: "2027" },
                ].map((item, idx) => (
                  <button key={idx} className="flex-shrink-0 flex flex-col items-center justify-center border border-gray-200 rounded-2xl p-4 w-28 hover:border-black hover:shadow-[0_2px_8px_rgba(0,0,0,0.12)] transition-shadow bg-white">
                    <svg className="h-8 w-8 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">{item.month}</span>
                    <span className="text-xs text-gray-500">{item.year}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activePanel === "who" && (
        <div className="absolute right-0 top-full z-50 mt-4 w-[400px] rounded-3xl border border-[#ddd] bg-white p-6 shadow-[0_6px_20px_rgba(0,0,0,0.2)]">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-[#ebebeb]">
              <div>
                <p className="font-semibold text-[var(--airbnb-dark)]">Adults</p>
                <p className="text-sm text-[var(--airbnb-foggy)]">Ages 13 or above</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={adults <= 0}
                  onClick={(e) => { e.stopPropagation(); setAdults(Math.max(0, adults - 1)); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-500 disabled:opacity-30 disabled:hover:border-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-4 text-center">{adults}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setAdults(adults + 1); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-6 border-b border-[#ebebeb]">
              <div>
                <p className="font-semibold text-[var(--airbnb-dark)]">Children</p>
                <p className="text-sm text-[var(--airbnb-foggy)]">Ages 2–12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={children <= 0}
                  onClick={(e) => { e.stopPropagation(); setChildren(Math.max(0, children - 1)); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-500 disabled:opacity-30 disabled:hover:border-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-4 text-center">{children}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setChildren(children + 1); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pb-6 border-b border-[#ebebeb]">
              <div>
                <p className="font-semibold text-[var(--airbnb-dark)]">Infants</p>
                <p className="text-sm text-[var(--airbnb-foggy)]">Under 2</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={infants <= 0}
                  onClick={(e) => { e.stopPropagation(); setInfants(Math.max(0, infants - 1)); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-500 disabled:opacity-30 disabled:hover:border-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-4 text-center">{infants}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setInfants(infants + 1); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-[var(--airbnb-dark)]">Pets</p>
                <a href="#" className="text-sm text-[var(--airbnb-foggy)] underline hover:text-black">Bringing a service animal?</a>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={pets <= 0}
                  onClick={(e) => { e.stopPropagation(); setPets(Math.max(0, pets - 1)); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-500 disabled:opacity-30 disabled:hover:border-gray-300"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-4 text-center">{pets}</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPets(pets + 1); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-500 hover:border-gray-500"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
