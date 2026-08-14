import Link from "next/link";
import { Heart } from "lucide-react";
import Badge, { BadgeType } from "./Badge";
import { useApp } from "@/context/AppContext";

export interface ExperienceData {
  id: string;
  title: string;
  location: string;
  price: string;
  rating: number;
  imageUrl: string;
  badge?: BadgeType;
  isWishlisted?: boolean;
}

interface Props {
  experience: ExperienceData;
}

export default function ExperienceCard({ experience }: Props) {
  const { wishlistIds, toggleWishlist } = useApp();
  const wishlisted = wishlistIds.includes(String(experience.id));

  return (
    <Link href={`/listing/${experience.id}`} className="group block w-full">
      <div className="relative mb-3 aspect-square overflow-hidden rounded-xl bg-[#f7f7f7]">
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {experience.badge && (
          <div className="absolute left-3 top-3">
            <Badge type={experience.badge} />
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(String(experience.id));
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

      <div className="mt-3 space-y-0.5">
        <h3 className="truncate text-[15px] font-medium text-[#222]">{experience.title}</h3>
        <div className="truncate text-[12px] text-[#717171]">
          {experience.price} / guest <span className="mx-1">·</span> ★ {experience.rating.toFixed(2)}
        </div>
      </div>
    </Link>
  );
}
