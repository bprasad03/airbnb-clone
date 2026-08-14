"use client";

import { useState, useEffect } from "react";
import { ExtendedListingDetail } from "@/lib/detailMockData";
import { formatPrice } from "@/lib/api";
import { Heart, Share, Star, Medal, ChevronRight, Grid } from "lucide-react";

interface Props {
  detail: ExtendedListingDetail;
}

export default function ListingDetailView({ detail }: Props) {
  const [showSubheader, setShowSubheader] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSubheader(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative pb-20">
      {/* 1. Sticky sub-header */}
      <div
        className={`fixed left-0 right-0 top-0 z-50 flex h-20 transform items-center justify-between border-b border-[#ebebeb] bg-white px-10 transition-transform duration-300 ${
          showSubheader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex gap-6 font-semibold text-[#222]">
          <a href="#photos" className="hover:underline">Photos</a>
          <a href="#amenities" className="hover:underline">Amenities</a>
          <a href="#reviews" className="hover:underline">Reviews</a>
          <a href="#location" className="hover:underline">Location</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold">{formatPrice(detail.price)} <span className="text-sm font-normal">night</span></div>
            <div className="flex items-center gap-1 text-xs text-[#717171]">
              <Star className="h-3 w-3 fill-current" />
              <span className="font-semibold text-[#222]">{detail.rating.toFixed(1)}</span>
              <span>· {detail.reviewCount} reviews</span>
            </div>
          </div>
          <button className="rounded-lg bg-[#ff385c] px-6 py-3 font-semibold text-white hover:bg-[#d90b63]">
            Reserve
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1120px] px-6 pt-6 md:px-10">
        
        {/* Title and top actions */}
        <div className="mb-6 flex items-start justify-between">
          <h1 className="text-3xl font-semibold text-[#222]">{detail.title}</h1>
          <div className="flex gap-4 underline">
            <button className="flex items-center gap-2 hover:bg-[#f7f7f7] rounded-lg px-2 py-1"><Share className="h-4 w-4" /> Share</button>
            <button className="flex items-center gap-2 hover:bg-[#f7f7f7] rounded-lg px-2 py-1">
              <Heart className={`h-4 w-4 ${detail.isWishlisted ? "fill-[#ff385c] stroke-[#ff385c]" : ""}`} /> 
              Save
            </button>
          </div>
        </div>

        {/* 2. Photo gallery */}
        <div id="photos" className="relative mb-8 grid grid-cols-4 gap-2 overflow-hidden rounded-xl md:grid-rows-2 md:h-[60vh] min-h-[400px]">
          <div className="col-span-4 md:col-span-2 md:row-span-2 h-full">
            <img src={detail.photos[0]} alt="cover" className="h-full w-full object-cover cursor-pointer hover:brightness-90 transition" />
          </div>
          <div className="hidden h-full md:block">
            <img src={detail.photos[1]} alt="photo 2" className="h-full w-full object-cover cursor-pointer hover:brightness-90 transition" />
          </div>
          <div className="hidden h-full md:block">
            <img src={detail.photos[2]} alt="photo 3" className="h-full w-full object-cover cursor-pointer hover:brightness-90 transition rounded-tr-xl" />
          </div>
          <div className="hidden h-full md:block">
            <img src={detail.photos[3]} alt="photo 4" className="h-full w-full object-cover cursor-pointer hover:brightness-90 transition" />
          </div>
          <div className="hidden h-full md:block">
            <img src={detail.photos[4]} alt="photo 5" className="h-full w-full object-cover cursor-pointer hover:brightness-90 transition rounded-br-xl" />
          </div>
          
          <button className="absolute bottom-6 right-6 flex items-center gap-2 rounded-lg border border-black bg-white px-4 py-1.5 font-semibold text-[#222] hover:bg-[#f7f7f7] shadow-sm">
            <Grid className="h-4 w-4" /> Show all photos
          </button>
        </div>

        {/* Layout for Main Content and Booking Widget */}
        <div className="flex flex-col gap-20 lg:flex-row">
          
          {/* Main Left Column */}
          <div className="flex-1 lg:w-2/3">
            
            {/* 3. Title block */}
            <div className="mb-8 border-b border-[#ebebeb] pb-6">
              <h2 className="mb-1 text-2xl font-semibold">{detail.typeLabel} in {detail.city}</h2>
              <ol className="flex flex-wrap items-center gap-1 text-[#222]">
                <li>{detail.guests} guests</li>
                <li><span className="mx-1">·</span>{detail.bedrooms} bedrooms</li>
                <li><span className="mx-1">·</span>{detail.beds} beds</li>
                <li><span className="mx-1">·</span>{detail.bathrooms} bathrooms</li>
              </ol>
              <div className="mt-4 flex items-center gap-2 font-semibold">
                <Star className="h-4 w-4 fill-current" />
                <span>{detail.rating.toFixed(2)}</span>
                <span className="text-[#717171] font-normal underline cursor-pointer hover:text-black">
                  · {detail.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* 4. Host row */}
            <div className="mb-8 flex items-center gap-4 border-b border-[#ebebeb] pb-6">
              <img src={detail.host.avatar} alt={detail.host.name} className="h-14 w-14 rounded-full object-cover" />
              <div>
                <h3 className="font-semibold">Hosted by {detail.host.name}</h3>
                <p className="text-[#717171]">
                  {detail.host.isSuperhost && "Superhost · "}
                  {detail.host.yearsHosting} years hosting
                </p>
              </div>
            </div>

            {/* 5. Highlights */}
            <div className="mb-8 border-b border-[#ebebeb] pb-6">
              <div className="flex flex-col gap-6">
                {detail.highlights.map((hl, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <span className="text-2xl">{hl.icon}</span>
                    <div>
                      <h4 className="font-semibold text-[#222]">{hl.title}</h4>
                      <p className="text-[#717171]">{hl.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Description */}
            <div className="mb-8 border-b border-[#ebebeb] pb-6">
              <p className="line-clamp-6 text-[#222] leading-relaxed">
                {detail.description}
              </p>
              <button className="mt-4 flex items-center font-semibold underline hover:text-black">
                Show more <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* 7. Amenities */}
            <div id="amenities" className="mb-8 border-b border-[#ebebeb] pb-6">
              <h2 className="mb-6 text-2xl font-semibold">What this place offers</h2>
              <div className="grid grid-cols-2 gap-4">
                {detail.amenities.map((amenity, i) => (
                  <div key={i} className={`flex items-center gap-4 text-[#222] ${!amenity.available && 'text-[#717171] line-through'}`}>
                    <span className="text-xl">{amenity.icon}</span>
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </div>
              <button className="mt-8 rounded-lg border border-black bg-white px-6 py-3 font-semibold text-[#222] hover:bg-[#f7f7f7]">
                Show all {detail.amenities.length} amenities
              </button>
            </div>

            {/* 9. Date picker */}
            <div className="mb-8 border-b border-[#ebebeb] pb-6">
              <h2 className="mb-2 text-2xl font-semibold">2 nights in {detail.city}</h2>
              <p className="mb-6 text-sm text-[#717171]">Nov 10, 2026 - Nov 12, 2026</p>
              
              <div className="grid grid-cols-2 gap-8 text-center text-[#222]">
                <div className="rounded-xl border border-[#ebebeb] p-6 bg-[#f7f7f7]/50 h-64 flex flex-col items-center justify-center">
                  <p className="text-[#717171] mb-2">November 2026</p>
                  <p className="text-2xl font-bold">[ Calendar UI Mock ]</p>
                </div>
                <div className="rounded-xl border border-[#ebebeb] p-6 bg-[#f7f7f7]/50 h-64 flex flex-col items-center justify-center">
                  <p className="text-[#717171] mb-2">December 2026</p>
                  <p className="text-2xl font-bold">[ Calendar UI Mock ]</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="font-semibold underline">Clear dates</button>
              </div>
            </div>
          </div>

          {/* 8. Booking widget (Sticky right) */}
          <div className="relative lg:w-1/3">
            <div className="sticky top-28 rounded-xl border border-[#ebebeb] bg-white p-6 shadow-xl">
              <div className="absolute -top-10 right-4 rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-600">
                🏷️ Prices include all fees
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-xl font-semibold line-through text-[#717171] mr-2">{formatPrice(detail.price * 1.2)}</span>
                <span className="text-2xl font-bold text-[#222]">{formatPrice(detail.price)}</span>
                <span className="text-[#222]"> night</span>
              </div>

              <div className="mb-4 rounded-xl border border-[#b0b0b0]">
                <div className="flex border-b border-[#b0b0b0]">
                  <div className="w-1/2 cursor-pointer border-r border-[#b0b0b0] p-3 hover:bg-[#f7f7f7] rounded-tl-xl">
                    <div className="text-[10px] font-bold uppercase text-[#222]">Check-in</div>
                    <div className="text-sm">10/11/2026</div>
                  </div>
                  <div className="w-1/2 cursor-pointer p-3 hover:bg-[#f7f7f7] rounded-tr-xl">
                    <div className="text-[10px] font-bold uppercase text-[#222]">Checkout</div>
                    <div className="text-sm">12/11/2026</div>
                  </div>
                </div>
                <div className="cursor-pointer p-3 hover:bg-[#f7f7f7] rounded-b-xl flex justify-between items-center">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-[#222]">Guests</div>
                    <div className="text-sm">1 guest</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#222]" />
                </div>
              </div>

              <button className="w-full rounded-xl bg-[#ff385c] py-3.5 text-center font-semibold text-white transition hover:bg-[#d90b63]">
                Reserve
              </button>
              <p className="mt-3 text-center text-sm text-[#222]">You won't be charged yet</p>

              <div className="mt-6 space-y-3 border-b border-[#ebebeb] pb-6 text-[#222]">
                <div className="flex justify-between">
                  <span className="underline">{formatPrice(detail.price)} x 2 nights</span>
                  <span>{formatPrice(detail.price * 2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Airbnb service fee</span>
                  <span>{formatPrice(detail.price * 0.15)}</span>
                </div>
              </div>
              <div className="mt-6 flex justify-between font-semibold text-[#222]">
                <span>Total</span>
                <span>{formatPrice(detail.price * 2 + detail.price * 0.15)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 10. Reviews */}
        <div id="reviews" className="mt-12 border-t border-[#ebebeb] pt-12">
          <div className="mb-8 flex items-center gap-2">
            <Star className="h-6 w-6 fill-current text-[#222]" />
            <h2 className="text-2xl font-semibold text-[#222]">
              {detail.rating.toFixed(2)} · {detail.reviewCount} reviews
            </h2>
          </div>
          
          <div className="mb-10 grid grid-cols-2 md:grid-cols-6 gap-x-6 gap-y-4">
            <div className="border-l-4 border-black pl-4">
              <div className="text-sm font-semibold">Cleanliness</div>
              <div className="text-lg font-bold">{detail.ratingBreakdown.cleanliness}</div>
            </div>
            <div className="border-l-4 border-black pl-4">
              <div className="text-sm font-semibold">Accuracy</div>
              <div className="text-lg font-bold">{detail.ratingBreakdown.accuracy}</div>
            </div>
            <div className="border-l-4 border-black pl-4">
              <div className="text-sm font-semibold">Communication</div>
              <div className="text-lg font-bold">{detail.ratingBreakdown.communication}</div>
            </div>
            <div className="border-l-4 border-black pl-4">
              <div className="text-sm font-semibold">Location</div>
              <div className="text-lg font-bold">{detail.ratingBreakdown.location}</div>
            </div>
            <div className="border-l-4 border-black pl-4">
              <div className="text-sm font-semibold">Check-in</div>
              <div className="text-lg font-bold">{detail.ratingBreakdown.checkIn}</div>
            </div>
            <div className="border-l-4 border-black pl-4">
              <div className="text-sm font-semibold">Value</div>
              <div className="text-lg font-bold">{detail.ratingBreakdown.value}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-10">
            {detail.reviews.map(review => (
              <div key={review.id}>
                <div className="mb-4 flex items-center gap-4">
                  <img src={review.authorAvatar} alt={review.authorName} className="h-12 w-12 rounded-full" />
                  <div>
                    <h3 className="font-semibold text-[#222]">{review.authorName}</h3>
                    <p className="text-sm text-[#717171]">{review.yearsOnAirbnb} years on Airbnb</p>
                  </div>
                </div>
                <div className="mb-2 flex items-center gap-2 text-xs">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-black' : 'fill-[#ebebeb]'}`} />
                    ))}
                  </div>
                  <span className="text-[#222]">·</span>
                  <span className="text-[#717171]">{review.date}</span>
                </div>
                <p className="text-[#222] leading-relaxed line-clamp-3">{review.text}</p>
                <button className="mt-2 font-semibold underline">Show more</button>
              </div>
            ))}
          </div>
          <button className="mt-10 rounded-lg border border-black bg-white px-6 py-3 font-semibold text-[#222] hover:bg-[#f7f7f7]">
            Show all {detail.reviewCount} reviews
          </button>
        </div>

        {/* 11. Location (Static map placeholder matching city) */}
        <div id="location" className="mt-12 border-t border-[#ebebeb] pt-12">
          <h2 className="mb-6 text-2xl font-semibold text-[#222]">Where you'll be</h2>
          <p className="mb-6 text-[#222]">{detail.city}, {detail.location}</p>
          <div className="relative h-[480px] w-full overflow-hidden rounded-xl bg-[#e5e3df]">
            {/* Using a Google Maps static-like image tailored with the city name as a placeholder */}
            <img 
              src={`https://placehold.co/1200x600/e5e3df/a19e99?text=Map+of+${encodeURIComponent(detail.city)}`} 
              alt={`Map of ${detail.city}`} 
              className="h-full w-full object-cover" 
            />
            {/* Mock exact pin */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ff385c]/20">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ff385c]">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
            {/* Map UI Chrome */}
            <div className="absolute top-4 left-4 rounded-md bg-white p-2 shadow-md flex items-center justify-center cursor-pointer">
              <span className="text-xl">🔍</span>
            </div>
            <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <div className="rounded-md bg-white shadow-md cursor-pointer hover:bg-gray-50 flex flex-col">
                <span className="px-3 py-2 border-b text-xl">+</span>
                <span className="px-3 py-2 text-xl">-</span>
              </div>
            </div>
          </div>
        </div>

        {/* 12. Host profile card */}
        <div className="mt-12 border-t border-[#ebebeb] pt-12">
          <h2 className="mb-6 text-2xl font-semibold text-[#222]">Meet your host</h2>
          <div className="rounded-xl border border-[#ebebeb] p-8 shadow-card flex flex-col md:flex-row gap-8 items-center bg-[#f7f7f7]/30">
            <div className="flex flex-col items-center flex-1 text-center border-r border-[#ebebeb] pr-8">
              <img src={detail.host.avatar} alt={detail.host.name} className="h-32 w-32 rounded-full mb-4 object-cover" />
              <h3 className="text-3xl font-bold">{detail.host.name}</h3>
              {detail.host.isSuperhost && <p className="text-sm font-semibold flex items-center gap-2 mt-2"><Medal className="h-4 w-4" /> Superhost</p>}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-y-4 text-[#222]">
              <div>
                <div className="text-2xl font-bold">{detail.host.reviewsCount}</div>
                <div className="text-xs">Reviews</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{detail.host.rating.toFixed(2)}</div>
                <div className="text-xs">Rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{detail.host.yearsHosting}</div>
                <div className="text-xs">Years hosting</div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-4 text-[#222]">
              <p>📍 Lives in {detail.city}</p>
              <p>🗣️ Speaks English, Hindi</p>
              <p className="text-[#717171]">{detail.host.name} is a Superhost. Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <p className="text-[#222]">Response rate: 100%</p>
              <p className="text-[#222]">Responds within an hour</p>
              <button className="self-start rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800">
                Message Host
              </button>
            </div>
          </div>
        </div>

        {/* 13. Things to know */}
        <div className="mt-12 border-t border-[#ebebeb] pt-12">
          <h2 className="mb-6 text-2xl font-semibold text-[#222]">Things to know</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[#222]">
            <div>
              <h3 className="font-semibold mb-4 text-lg">House rules</h3>
              <ul className="space-y-3">
                <li>🕒 Check-in after 14:00</li>
                <li>🕒 Checkout before 11:00</li>
                <li>👥 {detail.guests} guests maximum</li>
              </ul>
              <button className="mt-4 font-semibold underline">Show more</button>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-lg">Safety & property</h3>
              <ul className="space-y-3">
                <li>🚨 No carbon monoxide alarm</li>
                <li>🔥 Smoke alarm</li>
                <li>📹 Security cameras on property</li>
              </ul>
              <button className="mt-4 font-semibold underline">Show more</button>
            </div>
          </div>
        </div>

        {/* 14. Breadcrumbs & Related */}
        <div className="mt-12 border-t border-[#ebebeb] pt-12 pb-12">
          <div className="flex gap-2 text-sm text-[#717171] mb-8">
            <span className="hover:underline cursor-pointer">Airbnb</span> &gt;
            <span className="hover:underline cursor-pointer">India</span> &gt;
            <span className="hover:underline cursor-pointer">{detail.location}</span> &gt;
            <span className="hover:underline cursor-pointer font-semibold text-black">{detail.city}</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-6">Explore other options in and around {detail.city}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-4 text-sm text-[#717171]">
            <div><p className="text-[#222] font-semibold">Shimla</p><p>Holiday rentals</p></div>
            <div><p className="text-[#222] font-semibold">Manali</p><p>Holiday rentals</p></div>
            <div><p className="text-[#222] font-semibold">Jaipur</p><p>Holiday rentals</p></div>
            <div><p className="text-[#222] font-semibold">Goa</p><p>Holiday rentals</p></div>
            <div><p className="text-[#222] font-semibold">Udaipur</p><p>Holiday rentals</p></div>
            <div><p className="text-[#222] font-semibold">Pondicherry</p><p>Holiday rentals</p></div>
          </div>
        </div>
      </div>

    </div>
  );
}
