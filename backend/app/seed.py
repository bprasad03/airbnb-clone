from datetime import date, timedelta

from sqlalchemy.orm import Session

from .models import (
    Booking,
    Listing,
    ListingAmenity,
    ListingPhoto,
    Review,
    User,
    WishlistItem,
)

SAMPLE_PHOTOS = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    "https://images.unsplash.com/photo-1605276374104-dee2a782edfc?w=800",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800",
]

LISTINGS_DATA = [
    {
        "title": "Modern Villa with Pool in Goa",
        "description": "Escape to this stunning modern villa featuring a private pool, lush garden, and panoramic views. Perfect for families or groups seeking a luxurious beachside retreat in North Goa.",
        "location": "Anjuna, North Goa",
        "city": "Goa",
        "country": "India",
        "latitude": 15.5833,
        "longitude": 73.7333,
        "price_per_night": 8500,
        "property_type": "Villa",
        "max_guests": 8,
        "bedrooms": 4,
        "beds": 5,
        "baths": 3,
        "cleaning_fee": 1500,
        "amenities": ["Pool", "WiFi", "Kitchen", "Air conditioning", "Free parking", "Washer"],
    },
    {
        "title": "Heritage Haveli in Jaipur",
        "description": "Experience royal Rajasthan in this beautifully restored 200-year-old haveli. Intricate frescoes, courtyards, and rooftop dining with views of the Pink City.",
        "location": "Old City, Jaipur",
        "city": "Jaipur",
        "country": "India",
        "latitude": 26.9124,
        "longitude": 75.7873,
        "price_per_night": 6200,
        "property_type": "Heritage home",
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "baths": 2,
        "cleaning_fee": 800,
        "amenities": ["WiFi", "Breakfast", "Air conditioning", "Garden", "Rooftop terrace"],
    },
    {
        "title": "Cozy Apartment near Marine Drive",
        "description": "Bright and airy 1BHK apartment steps from Marine Drive. Watch the sunset from your balcony and explore Mumbai's best cafes and restaurants.",
        "location": "Marine Drive, Mumbai",
        "city": "Mumbai",
        "country": "India",
        "latitude": 18.9432,
        "longitude": 72.8236,
        "price_per_night": 4500,
        "property_type": "Apartment",
        "max_guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "baths": 1,
        "cleaning_fee": 500,
        "amenities": ["WiFi", "Kitchen", "Air conditioning", "Balcony", "Elevator"],
    },
    {
        "title": "Treehouse in Munnar Tea Gardens",
        "description": "Unique treehouse nestled among tea plantations with misty mountain views. Wake up to birdsong and enjoy fresh Kerala breakfast on your private deck.",
        "location": "Munnar, Kerala",
        "city": "Munnar",
        "country": "India",
        "latitude": 10.0889,
        "longitude": 77.0595,
        "price_per_night": 7800,
        "property_type": "Treehouse",
        "max_guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "baths": 1,
        "cleaning_fee": 600,
        "amenities": ["WiFi", "Breakfast", "Mountain view", "Hiking trails", "Fireplace"],
    },
    {
        "title": "Luxury Penthouse in Bangalore",
        "description": "Stylish penthouse in Indiranagar with floor-to-ceiling windows, modern kitchen, and access to rooftop lounge. Ideal for business travelers and couples.",
        "location": "Indiranagar, Bangalore",
        "city": "Bangalore",
        "country": "India",
        "latitude": 12.9784,
        "longitude": 77.6408,
        "price_per_night": 9200,
        "property_type": "Penthouse",
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "baths": 2,
        "cleaning_fee": 1200,
        "amenities": ["WiFi", "Kitchen", "Air conditioning", "Gym", "Rooftop lounge", "Workspace"],
    },
    {
        "title": "Beachfront Cottage in Gokarna",
        "description": "Rustic beachfront cottage with direct access to pristine Kudle Beach. Fall asleep to ocean waves and enjoy bonfires under the stars.",
        "location": "Kudle Beach, Gokarna",
        "city": "Gokarna",
        "country": "India",
        "latitude": 14.5500,
        "longitude": 74.3167,
        "price_per_night": 3800,
        "property_type": "Cottage",
        "max_guests": 3,
        "bedrooms": 1,
        "beds": 2,
        "baths": 1,
        "cleaning_fee": 400,
        "amenities": ["Beach access", "WiFi", "Outdoor dining", "Bonfire pit"],
    },
    {
        "title": "Houseboat on Dal Lake",
        "description": "Traditional Kashmiri houseboat with carved wood interiors, shikara rides included. Experience the magic of Srinagar from the water.",
        "location": "Dal Lake, Srinagar",
        "city": "Srinagar",
        "country": "India",
        "latitude": 34.1161,
        "longitude": 74.8530,
        "price_per_night": 5500,
        "property_type": "Houseboat",
        "max_guests": 4,
        "bedrooms": 2,
        "beds": 2,
        "baths": 1,
        "cleaning_fee": 700,
        "amenities": ["WiFi", "Breakfast", "Shikara ride", "Lake view", "Heating"],
    },
    {
        "title": "Desert Camp in Jaisalmer",
        "description": "Luxury desert camp with Swiss tents, folk music evenings, and camel safaris at sunset. An unforgettable Thar Desert experience.",
        "location": "Sam Sand Dunes, Jaisalmer",
        "city": "Jaisalmer",
        "country": "India",
        "latitude": 26.9157,
        "longitude": 70.9083,
        "price_per_night": 6800,
        "property_type": "Tent",
        "max_guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "baths": 1,
        "cleaning_fee": 500,
        "amenities": ["Breakfast", "Camel safari", "Bonfire", "Desert view", "Traditional dinner"],
    },
    {
        "title": "Colonial Bungalow in Ooty",
        "description": "Charming colonial-era bungalow surrounded by eucalyptus forests. Fireplace, vintage furniture, and a garden perfect for afternoon tea.",
        "location": "Ooty, Tamil Nadu",
        "city": "Ooty",
        "country": "India",
        "latitude": 11.4102,
        "longitude": 76.6950,
        "price_per_night": 5200,
        "property_type": "Bungalow",
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 4,
        "baths": 2,
        "cleaning_fee": 900,
        "amenities": ["WiFi", "Fireplace", "Garden", "Kitchen", "Mountain view"],
    },
    {
        "title": "Studio in Hauz Khas Village",
        "description": "Trendy studio apartment in Delhi's artistic Hauz Khas Village. Walk to galleries, boutiques, and the historic deer park.",
        "location": "Hauz Khas, New Delhi",
        "city": "New Delhi",
        "country": "India",
        "latitude": 28.5494,
        "longitude": 77.2001,
        "price_per_night": 3200,
        "property_type": "Studio",
        "max_guests": 2,
        "bedrooms": 1,
        "beds": 1,
        "baths": 1,
        "cleaning_fee": 400,
        "amenities": ["WiFi", "Kitchen", "Air conditioning", "Workspace", "Washer"],
    },
    {
        "title": "Backwater Villa in Alleppey",
        "description": "Serene villa on the Kerala backwaters with private dock and canoe. Watch village life drift by from your open-air living room.",
        "location": "Alleppey Backwaters",
        "city": "Alleppey",
        "country": "India",
        "latitude": 9.4981,
        "longitude": 76.3388,
        "price_per_night": 7200,
        "property_type": "Villa",
        "max_guests": 6,
        "bedrooms": 3,
        "beds": 3,
        "baths": 2,
        "cleaning_fee": 1000,
        "amenities": ["WiFi", "Kitchen", "Canoe", "Backwater view", "Breakfast"],
    },
    {
        "title": "Rooftop Loft in Pondicherry",
        "description": "French-colonial inspired loft with rooftop terrace overlooking the Promenade Beach. Colorful streets and cafes at your doorstep.",
        "location": "White Town, Pondicherry",
        "city": "Pondicherry",
        "country": "India",
        "latitude": 11.9416,
        "longitude": 79.8083,
        "price_per_night": 4100,
        "property_type": "Loft",
        "max_guests": 3,
        "bedrooms": 1,
        "beds": 2,
        "baths": 1,
        "cleaning_fee": 450,
        "amenities": ["WiFi", "Kitchen", "Rooftop terrace", "Air conditioning", "Beach nearby"],
    },
]


def seed_database(db: Session) -> None:
    if db.query(User).first():
        return

    guest = User(
        name="Priya Sharma",
        email="priya@example.com",
        avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
        is_host=False,
    )
    hosts = [
        User(
            name="Rajesh Kumar",
            email="rajesh@example.com",
            avatar_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
            is_host=True,
            is_superhost=True,
        ),
        User(
            name="Ananya Patel",
            email="ananya@example.com",
            avatar_url="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
            is_host=True,
            is_superhost=True,
        ),
        User(
            name="Vikram Singh",
            email="vikram@example.com",
            avatar_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
            is_host=True,
            is_superhost=False,
        ),
    ]
    db.add(guest)
    db.add_all(hosts)
    db.flush()

    listings: list[Listing] = []
    for index, data in enumerate(LISTINGS_DATA):
        host = hosts[index % len(hosts)]
        listing = Listing(
            host_id=host.id,
            title=data["title"],
            description=data["description"],
            location=data["location"],
            city=data["city"],
            country=data["country"],
            latitude=data["latitude"],
            longitude=data["longitude"],
            price_per_night=data["price_per_night"],
            property_type=data["property_type"],
            max_guests=data["max_guests"],
            bedrooms=data["bedrooms"],
            beds=data["beds"],
            baths=data["baths"],
            cleaning_fee=data["cleaning_fee"],
            rating=4.7 + (index % 3) * 0.1,
            review_count=12 + index * 3,
        )
        db.add(listing)
        db.flush()

        for photo_index, url in enumerate(
            [SAMPLE_PHOTOS[index % len(SAMPLE_PHOTOS)], SAMPLE_PHOTOS[(index + 3) % len(SAMPLE_PHOTOS)]]
        ):
            db.add(ListingPhoto(listing_id=listing.id, url=url, sort_order=photo_index))

        for amenity in data["amenities"]:
            db.add(ListingAmenity(listing_id=listing.id, name=amenity))

        listings.append(listing)

    db.add(
        Booking(
            listing_id=listings[0].id,
            guest_id=guest.id,
            check_in=date.today() + timedelta(days=14),
            check_out=date.today() + timedelta(days=17),
            guests=2,
            nightly_rate=listings[0].price_per_night,
            cleaning_fee=listings[0].cleaning_fee,
            service_fee=8500 * 3 * 0.14,
            total_price=8500 * 3 + listings[0].cleaning_fee + 8500 * 3 * 0.14,
            status="confirmed",
        )
    )
    db.add(
        Booking(
            listing_id=listings[2].id,
            guest_id=guest.id,
            check_in=date.today() + timedelta(days=30),
            check_out=date.today() + timedelta(days=33),
            guests=1,
            nightly_rate=listings[2].price_per_night,
            cleaning_fee=listings[2].cleaning_fee,
            service_fee=4500 * 3 * 0.14,
            total_price=4500 * 3 + listings[2].cleaning_fee + 4500 * 3 * 0.14,
            status="confirmed",
        )
    )

    db.add(
        Review(
            listing_id=listings[0].id,
            user_id=guest.id,
            rating=5,
            comment="Absolutely stunning villa! The pool was perfect and the host was incredibly welcoming.",
        )
    )
    db.add(
        Review(
            listing_id=listings[0].id,
            user_id=hosts[1].id,
            rating=5,
            comment="One of the best stays in Goa. Highly recommend for families.",
        )
    )
    db.add(
        Review(
            listing_id=listings[1].id,
            user_id=guest.id,
            rating=4,
            comment="Beautiful heritage property. The frescoes are breathtaking.",
        )
    )

    db.add(WishlistItem(user_id=guest.id, listing_id=listings[4].id))
    db.add(WishlistItem(user_id=guest.id, listing_id=listings[7].id))

    db.commit()
