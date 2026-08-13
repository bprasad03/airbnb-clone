"use client";

import {
  Building2,
  Castle,
  Home,
  Mountain,
  Palmtree,
  Ship,
  Tent,
  TreePine,
  Waves,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  All: <Home className="h-6 w-6" />,
  Villa: <Palmtree className="h-6 w-6" />,
  Apartment: <Building2 className="h-6 w-6" />,
  Cottage: <Home className="h-6 w-6" />,
  Treehouse: <TreePine className="h-6 w-6" />,
  Penthouse: <Building2 className="h-6 w-6" />,
  Houseboat: <Ship className="h-6 w-6" />,
  Tent: <Tent className="h-6 w-6" />,
  Bungalow: <Home className="h-6 w-6" />,
  Studio: <Building2 className="h-6 w-6" />,
  Loft: <Building2 className="h-6 w-6" />,
  "Heritage home": <Castle className="h-6 w-6" />,
};

interface Props {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryRow({ categories, selected, onSelect }: Props) {
  return (
    <div className="scrollbar-hide flex gap-8 overflow-x-auto border-b border-[#ebebeb] pb-4">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={`flex shrink-0 flex-col items-center gap-2 border-b-2 pb-3 transition-colors ${
            selected === category
              ? "border-[var(--airbnb-dark)] text-[var(--airbnb-dark)]"
              : "border-transparent text-[var(--airbnb-foggy)] hover:border-[var(--airbnb-light-gray)] hover:text-[var(--airbnb-dark)]"
          }`}
        >
          <div className={`[&>svg]:stroke-[1.5] [&>svg]:h-6 [&>svg]:w-6 ${selected === category ? "[&>svg]:stroke-[2]" : ""}`}>
            {CATEGORY_ICONS[category] || <Mountain className="h-6 w-6" />}
          </div>
          <span className={`text-xs whitespace-nowrap ${selected === category ? "font-bold" : "font-medium"}`}>
            {category}
          </span>
        </button>
      ))}
    </div>
  );
}
