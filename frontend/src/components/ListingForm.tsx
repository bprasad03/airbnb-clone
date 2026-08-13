"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useApp } from "@/context/AppContext";

const PROPERTY_TYPES = [
  "Apartment",
  "Villa",
  "Cottage",
  "Treehouse",
  "Penthouse",
  "Houseboat",
  "Tent",
  "Bungalow",
  "Studio",
  "Loft",
  "Heritage home",
];

const AMENITY_OPTIONS = [
  "WiFi",
  "Kitchen",
  "Air conditioning",
  "Pool",
  "Free parking",
  "Washer",
  "Breakfast",
  "Beach access",
  "Workspace",
  "Fireplace",
  "Garden",
  "Mountain view",
];

interface FormData {
  title: string;
  description: string;
  location: string;
  city: string;
  country: string;
  price_per_night: string;
  property_type: string;
  max_guests: string;
  bedrooms: string;
  beds: string;
  baths: string;
  cleaning_fee: string;
  photo_urls: string;
  amenities: string[];
}

const initialForm: FormData = {
  title: "",
  description: "",
  location: "",
  city: "",
  country: "India",
  price_per_night: "",
  property_type: "Apartment",
  max_guests: "2",
  bedrooms: "1",
  beds: "1",
  baths: "1",
  cleaning_fee: "500",
  photo_urls: "",
  amenities: [],
};

interface Props {
  listingId?: number;
  initial?: FormData;
}

export default function ListingForm({ listingId, initial = initialForm }: Props) {
  const router = useRouter();
  const { showToast } = useApp();
  const [form, setForm] = useState<FormData>(initial);
  const [loading, setLoading] = useState(false);

  const update = (field: keyof FormData, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      city: form.city,
      country: form.country,
      price_per_night: Number(form.price_per_night),
      property_type: form.property_type,
      max_guests: Number(form.max_guests),
      bedrooms: Number(form.bedrooms),
      beds: Number(form.beds),
      baths: Number(form.baths),
      cleaning_fee: Number(form.cleaning_fee),
      photo_urls: form.photo_urls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean),
      amenities: form.amenities,
    };

    try {
      if (listingId) {
        await api.updateListing(listingId, payload);
        showToast("Listing updated");
      } else {
        await api.createListing(payload);
        showToast("Listing created");
      }
      router.push("/host");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6 px-6 py-8">
      <h1 className="text-3xl font-semibold">
        {listingId ? "Edit listing" : "Create a new listing"}
      </h1>

      <div>
        <label className="mb-1 block text-sm font-semibold">Title</label>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
          placeholder="Cozy apartment in the city"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold">Description</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-semibold">Location</label>
          <input
            required
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">City</label>
          <input
            required
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-semibold">Price/night (₹)</label>
          <input
            required
            type="number"
            min="1"
            value={form.price_per_night}
            onChange={(e) => update("price_per_night", e.target.value)}
            className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Property type</label>
          <select
            value={form.property_type}
            onChange={(e) => update("property_type", e.target.value)}
            className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Cleaning fee (₹)</label>
          <input
            type="number"
            min="0"
            value={form.cleaning_fee}
            onChange={(e) => update("cleaning_fee", e.target.value)}
            className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {(["max_guests", "bedrooms", "beds", "baths"] as const).map((field) => (
          <div key={field}>
            <label className="mb-1 block text-sm font-semibold capitalize">
              {field.replace("_", " ")}
            </label>
            <input
              required
              type="number"
              min="0"
              value={form[field]}
              onChange={(e) => update(field, e.target.value)}
              className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
            />
          </div>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm font-semibold">
          Photo URLs (one per line)
        </label>
        <textarea
          rows={3}
          value={form.photo_urls}
          onChange={(e) => update("photo_urls", e.target.value)}
          placeholder="https://images.unsplash.com/photo-..."
          className="w-full rounded-lg border border-[#ddd] px-4 py-3 outline-none focus:border-[#222]"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`rounded-full border px-4 py-2 text-sm ${
                form.amenities.includes(amenity)
                  ? "border-[#222] bg-[#222] text-white"
                  : "border-[#ddd] hover:border-[#222]"
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#ff385c] py-3.5 font-semibold text-white hover:bg-[#e31c5f] disabled:opacity-60"
      >
        {loading ? "Saving..." : listingId ? "Update listing" : "Create listing"}
      </button>
    </form>
  );
}
