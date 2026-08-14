"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import ExperienceCard from "@/components/ExperienceCard";
import ServiceCard from "@/components/ServiceCard";
import { dummyHomes, dummyExperiences, dummyServices } from "@/lib/mockData";
import { useApp } from "@/context/AppContext";

import CarouselSection from "@/components/CarouselSection";



export default function AllPage() {
  const { showToast } = useApp();

  const handleWishlist = () => {
    showToast("Updated wishlist");
  };

  return (
    <div>
      <section className="mx-auto max-w-[1760px] px-12 py-10 md:px-24 lg:px-32 xl:px-48">
        <CarouselSection title="Top rated places to stay">
          {dummyHomes.slice(0, 10).map((listing) => {
            const cardWrapperClass = "w-[85%] sm:w-[calc(100%/2.25)] md:w-[calc(100%/3.4)] lg:w-[calc(100%/4.7)] xl:w-[calc(100%/6.1)] 2xl:w-[calc(100%/7.4)] flex-shrink-0 snap-start";
            return (
              <div key={listing.id} className={cardWrapperClass}>
                <ListingCard listing={listing} />
              </div>
            );
          })}
        </CarouselSection>

        <CarouselSection title="Experiences for you">
          {dummyExperiences.slice(0, 10).map((experience) => {
            const cardWrapperClass = "w-[85%] sm:w-[calc(100%/2.25)] md:w-[calc(100%/3.4)] lg:w-[calc(100%/4.7)] xl:w-[calc(100%/6.1)] 2xl:w-[calc(100%/7.4)] flex-shrink-0 snap-start";
            return (
              <div key={experience.id} className={cardWrapperClass}>
                <ExperienceCard experience={experience} />
              </div>
            );
          })}
        </CarouselSection>

        <CarouselSection title="Popular services">
          {dummyServices.slice(0, 10).map((service) => {
            const cardWrapperClass = "w-[85%] sm:w-[calc(100%/2.25)] md:w-[calc(100%/3.4)] lg:w-[calc(100%/4.7)] xl:w-[calc(100%/6.1)] 2xl:w-[calc(100%/7.4)] flex-shrink-0 snap-start";
            return (
              <div key={service.id} className={cardWrapperClass}>
                <ServiceCard service={service} />
              </div>
            );
          })}
        </CarouselSection>

        <div className="mt-8 flex justify-center pb-12">
          <button className="rounded-lg border border-black bg-white px-6 py-3 font-semibold text-[var(--airbnb-dark)] hover:bg-[#f7f7f7] transition">
            Show more
          </button>
        </div>
      </section>
    </div>
  );
}
