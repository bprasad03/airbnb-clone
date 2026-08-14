import { dummyHomes, dummyExperiences, dummyServices } from "./mockData";

export interface Highlight {
  icon: string;
  title: string;
  description: string;
}

export interface Amenity {
  icon: string;
  name: string;
  available: boolean;
}

export interface ExpandedReview {
  id: number;
  authorName: string;
  authorAvatar: string;
  yearsOnAirbnb: number;
  rating: number;
  date: string;
  text: string;
}

export interface ExtendedListingDetail {
  id: string | number;
  title: string;
  location: string;
  city: string;
  price: number;
  rating: number;
  reviewCount: number;
  isWishlisted: boolean;
  typeLabel: string;
  photos: string[];
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  host: {
    name: string;
    avatar: string;
    isSuperhost: boolean;
    yearsHosting: number;
    reviewsCount: number;
    rating: number;
  };
  highlights: Highlight[];
  description: string;
  amenities: Amenity[];
  ratingBreakdown: {
    cleanliness: number;
    accuracy: number;
    communication: number;
    location: number;
    checkIn: number;
    value: number;
  };
  reviews: ExpandedReview[];
}

const FIRST_NAMES = ["Himani", "Rajesh", "Priya", "Amit", "Neha", "Vikram", "Sneha", "Rahul", "Anjali", "Suresh"];

export function getListingDetail(idStr: string): ExtendedListingDetail | null {
  if (!idStr) return null;
  const isExperience = idStr.startsWith('e');
  const isService = idStr.startsWith('s');
  
  let baseData: any = null;
  let typeLabel = "Entire rental unit";

  if (isExperience) {
    baseData = dummyExperiences.find(e => e.id === idStr);
    typeLabel = "Experience";
  } else if (isService) {
    baseData = dummyServices.find(s => s.id === idStr);
    typeLabel = "Service";
  } else {
    baseData = dummyHomes.find(h => h.id.toString() === idStr);
    if (baseData) typeLabel = baseData.property_type;
  }

  if (!baseData) return null;

  // Extract base fields safely
  const title = baseData.title;
  let price = 0;
  if (typeof baseData.price_per_night === 'number') price = baseData.price_per_night;
  else if (typeof baseData.price === 'string') price = parseInt(baseData.price.replace(/[^0-9]/g, ''), 10);
  
  const rating = baseData.rating || 4.5;
  const reviewCount = baseData.review_count || Math.floor(Math.random() * 200) + 15;
  const location = baseData.location || "India";
  let city = baseData.city || "India";
  if (isExperience || isService) {
    if (location.includes(",")) city = location.split(",")[0].trim();
  }
  
  const coverPhoto = baseData.cover_photo || baseData.imageUrl;

  const numericId = parseInt(idStr.replace(/[^0-9]/g, ''), 10) || 1;
  const seed = numericId * 13;

  return {
    id: idStr,
    title,
    location,
    city,
    price,
    rating,
    reviewCount,
    isWishlisted: !!baseData.is_wishlisted || !!baseData.isWishlisted,
    typeLabel,
    photos: [
      coverPhoto,
      `https://picsum.photos/seed/d1_${seed}/800/600`,
      `https://picsum.photos/seed/d2_${seed}/800/600`,
      `https://picsum.photos/seed/d3_${seed}/800/600`,
      `https://picsum.photos/seed/d4_${seed}/800/600`
    ],
    guests: (seed % 6) + 2,
    bedrooms: (seed % 4) + 1,
    beds: (seed % 5) + 1,
    bathrooms: (seed % 3) + 1,
    host: {
      name: FIRST_NAMES[seed % FIRST_NAMES.length],
      avatar: `https://i.pravatar.cc/150?u=${seed}`,
      isSuperhost: seed % 2 === 0,
      yearsHosting: (seed % 8) + 1,
      reviewsCount: (seed * 7) % 500 + 50,
      rating: 4.8 + (seed % 20) / 100
    },
    highlights: [
      { icon: "🏊", title: "Dive right in", description: "This is one of the few places in the area with a pool." },
      { icon: "🔍", title: "Exceptional check-in experience", description: "Recent guests gave the check-in process a 5-star rating." },
      { icon: "📍", title: "Unbeatable location", description: "100% of recent guests gave the location a 5-star rating." }
    ],
    description: `Welcome to this beautiful ${typeLabel.toLowerCase()} in ${city}! This stunning property offers everything you need for a comfortable and memorable stay. Designed with elegance and practicality in mind, the space features modern amenities, cozy furnishings, and plenty of natural light. Whether you're here to relax or explore, you'll find this to be the perfect home base. We pride ourselves on providing an exceptional experience, from the moment you book until checkout. Come and see why our guests love staying here!`,
    amenities: [
      { icon: "🍳", name: "Kitchen", available: true },
      { icon: "📶", name: "Wifi", available: true },
      { icon: "🚗", name: "Free parking on premises", available: true },
      { icon: "🏊", name: "Pool", available: true },
      { icon: "📺", name: "TV", available: true },
      { icon: "🏢", name: "Lift", available: true },
      { icon: "🧺", name: "Washing machine", available: true },
      { icon: "❄️", name: "Air conditioning", available: true },
      { icon: "📹", name: "Security cameras on property", available: true },
      { icon: "🚨", name: "Carbon monoxide alarm", available: false }
    ],
    ratingBreakdown: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 5.0,
      location: 4.9,
      checkIn: 5.0,
      value: 4.7
    },
    reviews: [
      {
        id: 1,
        authorName: "Sarah",
        authorAvatar: `https://i.pravatar.cc/150?u=sarah${seed}`,
        yearsOnAirbnb: 4,
        rating: 5,
        date: "October 2023",
        text: "Absolutely stunning place! The host was incredibly responsive and helpful. We loved the aesthetic and the location was perfect for our trip. Would highly recommend."
      },
      {
        id: 2,
        authorName: "Michael",
        authorAvatar: `https://i.pravatar.cc/150?u=michael${seed}`,
        yearsOnAirbnb: 2,
        rating: 4,
        date: "September 2023",
        text: "Great stay overall. The amenities were exactly as described. Check-in was a breeze. Only minor issue was the wifi was a bit slow on one of the days, but otherwise fantastic."
      },
      {
        id: 3,
        authorName: "Aarti",
        authorAvatar: `https://i.pravatar.cc/150?u=aarti${seed}`,
        yearsOnAirbnb: 6,
        rating: 5,
        date: "August 2023",
        text: "One of the best Airbnb experiences I've had. The attention to detail is remarkable. The neighborhood is safe and quiet, yet close to all the main attractions."
      }
    ]
  };
}
