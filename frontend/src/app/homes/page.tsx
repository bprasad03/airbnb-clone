"use client";

import { useApp } from "@/context/AppContext";
import ListingCard from "@/components/ListingCard";
import CarouselSection from "@/components/CarouselSection";
import { dummyHomes } from "@/lib/mockData";

export default function HomesPage() {
  const { showToast } = useApp();

  const handleWishlist = () => {
    showToast("Updated wishlist");
  };

  const cardWrapperClass = "w-[85%] sm:w-[calc(100%/2.25)] md:w-[calc(100%/3.4)] lg:w-[calc(100%/4.7)] xl:w-[calc(100%/6.1)] 2xl:w-[calc(100%/7.4)] flex-shrink-0 snap-start";

  // Slice dummy data for different sections
  const popularHomes = dummyHomes.slice(0, 10);
  const weekendHomes = dummyHomes.slice(10, 20);
  const stayHomes = dummyHomes.slice(20, 30);

  return (
    <div>
      <section className="mx-auto max-w-[1760px] px-12 py-10 md:px-24 lg:px-32 xl:px-48">
        
        <CarouselSection title="Popular homes in Goa">
          {popularHomes.map((listing) => (
            <div key={listing.id} className={cardWrapperClass}>
              <ListingCard listing={listing} onWishlistToggle={handleWishlist} />
            </div>
          ))}
        </CarouselSection>

        <CarouselSection title="Available in Chandigarh this weekend">
          {weekendHomes.map((listing) => (
            <div key={listing.id} className={cardWrapperClass}>
              <ListingCard listing={listing} onWishlistToggle={handleWishlist} />
            </div>
          ))}
        </CarouselSection>

        <CarouselSection title="Stay in Pondicherry">
          {stayHomes.map((listing) => (
            <div key={listing.id} className={cardWrapperClass}>
              <ListingCard listing={listing} onWishlistToggle={handleWishlist} />
            </div>
          ))}
        </CarouselSection>

      </section>
    </div>
  );
}
