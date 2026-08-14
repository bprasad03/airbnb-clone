import { Star } from "lucide-react";

export type BadgeType = "guest-favourite" | "popular" | "bestseller" | "premium" | "new";

interface Props {
  type: BadgeType;
}

export default function Badge({ type }: Props) {
  switch (type) {
    case "guest-favourite":
      return (
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm">
          Guest favourite
        </div>
      );
    case "popular":
      return (
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm">
          <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
          Popular
        </div>
      );
    case "bestseller":
      return (
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm">
          <Star className="h-3 w-3 fill-orange-500 text-orange-500" />
          Bestseller
        </div>
      );
    case "premium":
      return (
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm">
          Premium
        </div>
      );
    case "new":
      return (
        <div className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-900 shadow-sm">
          New
        </div>
      );
    default:
      return null;
  }
}
