from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..deps import get_current_user_id
from ..models import Booking, Listing, ListingAmenity, ListingPhoto, User, WishlistItem
from ..schemas import (
    AvailabilityOut,
    BookingCreate,
    BookingOut,
    HostOut,
    ListingCardOut,
    ListingCreate,
    ListingDetailOut,
    ListingUpdate,
    PaginatedListings,
    PriceBreakdown,
    UserOut,
)

router = APIRouter(prefix="/listings", tags=["listings"])


def _cover_photo(listing: Listing) -> str | None:
    if listing.photos:
        return sorted(listing.photos, key=lambda p: p.sort_order)[0].url
    return None


def _is_wishlisted(db: Session, listing_id: int, user_id: int) -> bool:
    return (
        db.query(WishlistItem)
        .filter(WishlistItem.user_id == user_id, WishlistItem.listing_id == listing_id)
        .first()
        is not None
    )


def _listing_to_card(db: Session, listing: Listing, user_id: int) -> ListingCardOut:
    return ListingCardOut(
        id=listing.id,
        title=listing.title,
        location=listing.location,
        city=listing.city,
        country=listing.country,
        price_per_night=listing.price_per_night,
        property_type=listing.property_type,
        rating=listing.rating,
        review_count=listing.review_count,
        cover_photo=_cover_photo(listing),
        is_wishlisted=_is_wishlisted(db, listing.id, user_id),
    )


@router.get("", response_model=PaginatedListings)
def search_listings(
    location: str | None = None,
    check_in: date | None = None,
    check_out: date | None = None,
    guests: int | None = Query(default=None, ge=1),
    property_type: str | None = None,
    min_price: float | None = Query(default=None, ge=0),
    max_price: float | None = Query(default=None, ge=0),
    amenities: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=12, ge=1, le=48),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    query = db.query(Listing).options(joinedload(Listing.photos))

    if location:
        term = f"%{location.lower()}%"
        query = query.filter(
            or_(
                func.lower(Listing.city).like(term),
                func.lower(Listing.country).like(term),
                func.lower(Listing.location).like(term),
                func.lower(Listing.title).like(term),
            )
        )

    if guests:
        query = query.filter(Listing.max_guests >= guests)

    if property_type and property_type != "All":
        query = query.filter(Listing.property_type == property_type)

    if min_price is not None:
        query = query.filter(Listing.price_per_night >= min_price)

    if max_price is not None:
        query = query.filter(Listing.price_per_night <= max_price)

    if amenities:
        amenity_list = [a.strip() for a in amenities.split(",") if a.strip()]
        for amenity in amenity_list:
            query = query.filter(
                Listing.id.in_(
                    db.query(ListingAmenity.listing_id).filter(
                        func.lower(ListingAmenity.name) == amenity.lower()
                    )
                )
            )

    if check_in and check_out:
        if check_out <= check_in:
            raise HTTPException(status_code=400, detail="Check-out must be after check-in")

        overlapping = (
            db.query(Booking.listing_id)
            .filter(
                Booking.status == "confirmed",
                Booking.check_in < check_out,
                Booking.check_out > check_in,
            )
            .distinct()
        )
        query = query.filter(~Listing.id.in_(overlapping))

    total = query.count()
    listings = (
        query.order_by(Listing.rating.desc(), Listing.review_count.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return PaginatedListings(
        items=[_listing_to_card(db, listing, user_id) for listing in listings],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=max(1, (total + page_size - 1) // page_size),
    )


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    types = db.query(Listing.property_type).distinct().all()
    return {"categories": ["All"] + sorted(t[0] for t in types)}


@router.get("/{listing_id}", response_model=ListingDetailOut)
def get_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    listing = (
        db.query(Listing)
        .options(
            joinedload(Listing.photos),
            joinedload(Listing.amenities),
            joinedload(Listing.host),
        )
        .filter(Listing.id == listing_id)
        .first()
    )
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    return ListingDetailOut(
        id=listing.id,
        title=listing.title,
        description=listing.description,
        location=listing.location,
        city=listing.city,
        country=listing.country,
        latitude=listing.latitude,
        longitude=listing.longitude,
        price_per_night=listing.price_per_night,
        property_type=listing.property_type,
        max_guests=listing.max_guests,
        bedrooms=listing.bedrooms,
        beds=listing.beds,
        baths=listing.baths,
        cleaning_fee=listing.cleaning_fee,
        service_fee_percent=listing.service_fee_percent,
        rating=listing.rating,
        review_count=listing.review_count,
        host=HostOut.model_validate(listing.host),
        photos=sorted(listing.photos, key=lambda p: p.sort_order),
        amenities=listing.amenities,
        is_wishlisted=_is_wishlisted(db, listing.id, user_id),
        created_at=listing.created_at,
    )


@router.get("/{listing_id}/availability", response_model=AvailabilityOut)
def get_availability(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    bookings = (
        db.query(Booking)
        .filter(Booking.listing_id == listing_id, Booking.status == "confirmed")
        .all()
    )
    return AvailabilityOut(
        booked_ranges=[{"check_in": b.check_in, "check_out": b.check_out} for b in bookings]
    )


@router.get("/{listing_id}/price", response_model=PriceBreakdown)
def calculate_price(
    listing_id: int,
    check_in: date,
    check_out: date,
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if check_out <= check_in:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")

    nights = (check_out - check_in).days
    subtotal = nights * listing.price_per_night
    service_fee = round(subtotal * listing.service_fee_percent / 100, 2)
    total = subtotal + listing.cleaning_fee + service_fee

    return PriceBreakdown(
        nights=nights,
        nightly_rate=listing.price_per_night,
        subtotal=subtotal,
        cleaning_fee=listing.cleaning_fee,
        service_fee=service_fee,
        total=total,
    )


@router.post("", response_model=ListingDetailOut, status_code=201)
def create_listing(
    payload: ListingCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    host = db.query(User).filter(User.id == user_id).first()
    if not host:
        raise HTTPException(status_code=404, detail="User not found")

    if not host.is_host:
        host.is_host = True

    listing = Listing(
        host_id=host.id,
        title=payload.title,
        description=payload.description,
        location=payload.location,
        city=payload.city,
        country=payload.country,
        latitude=payload.latitude,
        longitude=payload.longitude,
        price_per_night=payload.price_per_night,
        property_type=payload.property_type,
        max_guests=payload.max_guests,
        bedrooms=payload.bedrooms,
        beds=payload.beds,
        baths=payload.baths,
        cleaning_fee=payload.cleaning_fee,
        service_fee_percent=payload.service_fee_percent,
    )
    db.add(listing)
    db.flush()

    for index, url in enumerate(payload.photo_urls):
        db.add(ListingPhoto(listing_id=listing.id, url=url, sort_order=index))

    for amenity in payload.amenities:
        db.add(ListingAmenity(listing_id=listing.id, name=amenity))

    db.commit()
    db.refresh(listing)
    return get_listing(listing.id, db, user_id)


@router.put("/{listing_id}", response_model=ListingDetailOut)
def update_listing(
    listing_id: int,
    payload: ListingUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.host_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this listing")

    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "photo_urls" and value is not None:
            db.query(ListingPhoto).filter(ListingPhoto.listing_id == listing_id).delete()
            for index, url in enumerate(value):
                db.add(ListingPhoto(listing_id=listing_id, url=url, sort_order=index))
        elif field == "amenities" and value is not None:
            db.query(ListingAmenity).filter(ListingAmenity.listing_id == listing_id).delete()
            for amenity in value:
                db.add(ListingAmenity(listing_id=listing_id, name=amenity))
        elif field not in ("photo_urls", "amenities"):
            setattr(listing, field, value)

    db.commit()
    return get_listing(listing_id, db, user_id)


@router.delete("/{listing_id}", status_code=204)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.host_id != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this listing")

    db.delete(listing)
    db.commit()
