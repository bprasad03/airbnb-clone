import { Heart } from "lucide-react";
import { useState } from "react";

export interface ServiceData {
  id: string;
  title: string;
  price: string;
  rating: number;
  imageUrl: string;
  badge?: string;
  isWishlisted?: boolean;
}

interface Props {
  service: ServiceData;
}

export default function ServiceCard({ service }: Props) {
  const [wishlisted, setWishlisted] = useState(service.isWishlisted ?? false);

  return (
    <div className="group block w-full">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-[#f7f7f7]">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {service.badge && (
          <div className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-sm">
            {service.badge}
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setWishlisted(!wishlisted);
          }}
          className="absolute right-3 top-3 rounded-full p-1 transition-transform hover:scale-110"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-6 w-6 drop-shadow-md ${
              wishlisted
                ? "fill-[#ff385c] stroke-[#ff385c]"
                : "fill-black/50 stroke-white"
            }`}
          />
        </button>
      </div>

      <div className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold text-[var(--airbnb-dark)]">{service.title}</h3>
          <div className="flex shrink-0 items-center gap-1 text-sm">
            <svg viewBox="0 0 32 32" className="h-3 w-3 fill-current">
              <path d="M15.5 2.5l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" />
            </svg>
            <span>{service.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="mt-1">
          <span className="font-semibold text-[var(--airbnb-dark)]">{service.price}</span>
        </p>
      </div>
    </div>
  );
}
