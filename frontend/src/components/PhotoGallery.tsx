"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  photos: { id: number; url: string }[];
  title: string;
}

export default function PhotoGallery({ photos, title }: Props) {
  const [lightbox, setLightbox] = useState(false);
  const [index, setIndex] = useState(0);

  if (!photos.length) {
    return (
      <div className="flex aspect-[2/1] items-center justify-center rounded-xl bg-[#f7f7f7]">
        No photos available
      </div>
    );
  }

  const sorted = [...photos].sort((a, b) => a.id - b.id);

  return (
    <>
      <div className="relative hidden h-[480px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl md:grid">
        <button
          type="button"
          onClick={() => {
            setIndex(0);
            setLightbox(true);
          }}
          className="col-span-2 row-span-2 overflow-hidden"
        >
          <img src={sorted[0].url} alt={title} className="h-full w-full object-cover hover:brightness-95" />
        </button>
        {sorted.slice(1, 5).map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => {
              setIndex(i + 1);
              setLightbox(true);
            }}
            className="overflow-hidden"
          >
            <img src={photo.url} alt={title} className="h-full w-full object-cover hover:brightness-95" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="absolute bottom-6 right-6 rounded-lg border border-[#222] bg-white px-4 py-2 text-sm font-semibold hover:bg-[#f7f7f7]"
        >
          Show all photos
        </button>
      </div>

      <button
        type="button"
        onClick={() => setLightbox(true)}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-xl md:hidden"
      >
        <img src={sorted[0].url} alt={title} className="h-full w-full object-cover" />
        <span className="absolute bottom-4 right-4 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold">
          1 / {sorted.length}
        </span>
      </button>

      {lightbox && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90">
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => setIndex((i) => (i - 1 + sorted.length) % sorted.length)}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img
            src={sorted[index].url}
            alt={title}
            className="max-h-[85vh] max-w-[90vw] object-contain"
          />
          <button
            type="button"
            onClick={() => setIndex((i) => (i + 1) % sorted.length)}
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
