"use client";

import ServiceCard from "@/components/ServiceCard";
import CarouselSection from "@/components/CarouselSection";
import { dummyServices } from "@/lib/mockData";

export default function ServicesPage() {
  const cardWrapperClass = "w-[85%] sm:w-[calc(100%/2.25)] md:w-[calc(100%/3.4)] lg:w-[calc(100%/4.7)] xl:w-[calc(100%/6.1)] 2xl:w-[calc(100%/7.4)] flex-shrink-0 snap-start";

  // Slice dummy data for different sections
  const popularServices = dummyServices.slice(0, 10);
  const cityServices = dummyServices.slice(10, 20);

  return (
    <div>
      <section className="mx-auto max-w-[1760px] px-12 py-10 md:px-24 lg:px-32 xl:px-48">
        
        <CarouselSection title="Services in Gurgaon District">
          {popularServices.map((service) => (
            <div key={service.id} className={cardWrapperClass}>
              <ServiceCard service={service} />
            </div>
          ))}
        </CarouselSection>

        <CarouselSection title="Services near you">
          {cityServices.map((service) => (
            <div key={service.id} className={cardWrapperClass}>
              <ServiceCard service={service} />
            </div>
          ))}
        </CarouselSection>

      </section>
    </div>
  );
}
