"use client";

import ExperienceCard from "@/components/ExperienceCard";
import CarouselSection from "@/components/CarouselSection";
import { dummyExperiences } from "@/lib/mockData";

export default function ExperiencesPage() {
  const cardWrapperClass = "w-[85%] sm:w-[calc(100%/2.25)] md:w-[calc(100%/3.4)] lg:w-[calc(100%/4.7)] xl:w-[calc(100%/6.1)] 2xl:w-[calc(100%/7.4)] flex-shrink-0 snap-start";

  // Slice dummy data for different sections
  const popularExperiences = dummyExperiences.slice(0, 10);
  const cityExperiences = dummyExperiences.slice(10, 20);

  return (
    <div>
      <section className="mx-auto max-w-[1760px] px-12 py-10 md:px-24 lg:px-32 xl:px-48">
        
        <CarouselSection title="Popular experiences near you">
          {popularExperiences.map((experience) => (
            <div key={experience.id} className={cardWrapperClass}>
              <ExperienceCard experience={experience} />
            </div>
          ))}
        </CarouselSection>

        <CarouselSection title="Things to do in Jaipur">
          {cityExperiences.map((experience) => (
            <div key={experience.id} className={cardWrapperClass}>
              <ExperienceCard experience={experience} />
            </div>
          ))}
        </CarouselSection>

      </section>
    </div>
  );
}
