"use client";

import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  minPrice: string;
  maxPrice: string;
  onMinPriceChange: (v: string) => void;
  onMaxPriceChange: (v: string) => void;
  onApply: () => void;
}

export default function FilterModal({
  open,
  onClose,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  onApply,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-lg rounded-t-2xl bg-white p-6 sm:rounded-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Price range (per night)</label>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
                className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-[#ebebeb] pt-4">
          <button
            type="button"
            onClick={() => {
              onMinPriceChange("");
              onMaxPriceChange("");
            }}
            className="text-sm font-semibold underline"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => {
              onApply();
              onClose();
            }}
            className="rounded-lg bg-[#222] px-6 py-3 text-sm font-semibold text-white hover:bg-black"
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
