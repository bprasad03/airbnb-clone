"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ListingCard from "@/components/ListingCard";
import ExperienceCard from "@/components/ExperienceCard";
import ServiceCard from "@/components/ServiceCard";
import { useApp } from "@/context/AppContext";
import { dummyHomes, dummyExperiences, dummyServices } from "@/lib/mockData";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { wishlistIds } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10">
        <h1 className="mb-8 text-3xl font-semibold">Wishlists</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-xl bg-[#f0f0f0]" />
          ))}
        </div>
      </div>
    );
  }

  const renderedItems = wishlistIds.map(id => {
    if (id.startsWith('e')) {
      const exp = dummyExperiences.find(e => e.id === id);
      return exp ? <ExperienceCard key={id} experience={exp} /> : null;
    } else if (id.startsWith('s')) {
      const srv = dummyServices.find(s => s.id === id);
      return srv ? <ServiceCard key={id} service={srv} /> : null;
    } else {
      const home = dummyHomes.find(h => String(h.id) === id);
      return home ? <ListingCard key={id} listing={home} /> : null;
    }
  });

  const hasItems = renderedItems.some(item => item !== null);

  return (
    <div className="mx-auto max-w-[1760px] px-6 py-8 md:px-10">
      <h1 className="mb-8 text-3xl font-semibold">Wishlists</h1>

      {!hasItems ? (
        <div className="py-16 text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 text-[#717171]" />
          <h2 className="text-xl font-semibold">Create your first wishlist</h2>
          <p className="mt-2 text-[#717171]">
            As you search, tap the heart icon to save your favorite places.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-lg bg-[#222] px-6 py-3 text-sm font-semibold text-white"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {renderedItems}
        </div>
      )}
    </div>
  );
}
