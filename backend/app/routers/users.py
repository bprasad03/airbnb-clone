from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..deps import get_current_user_id
from ..models import Listing, Review, User, WishlistItem
from ..schemas import HostOut, ListingCardOut, ReviewOut, UserOut, WishlistToggleOut

router = APIRouter(tags=["users"])


def _cover_photo(listing: Listing) -> str | None:
    if listing.photos:
        return sorted(listing.photos, key=lambda p: p.sort_order)[0].url
    return None


@router.get("/users/me", response_model=UserOut)
def get_current_user(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/users/me/listings", response_model=list[ListingCardOut])
def get_my_listings(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    listings = (
        db.query(Listing)
        .options(joinedload(Listing.photos))
        .filter(Listing.host_id == user_id)
        .order_by(Listing.created_at.desc())
        .all()
    )
    return [
        ListingCardOut(
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
            is_wishlisted=False,
        )
        for listing in listings
    ]


@router.get("/wishlist", response_model=list[ListingCardOut])
def get_wishlist(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    items = (
        db.query(WishlistItem)
        .options(joinedload(WishlistItem.listing).joinedload(Listing.photos))
        .filter(WishlistItem.user_id == user_id)
        .all()
    )
    return [
        ListingCardOut(
            id=item.listing.id,
            title=item.listing.title,
            location=item.listing.location,
            city=item.listing.city,
            country=item.listing.country,
            price_per_night=item.listing.price_per_night,
            property_type=item.listing.property_type,
            rating=item.listing.rating,
            review_count=item.listing.review_count,
            cover_photo=_cover_photo(item.listing),
            is_wishlisted=True,
        )
        for item in items
    ]


@router.post("/wishlist/{listing_id}", response_model=WishlistToggleOut)
def toggle_wishlist(
    listing_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    existing = (
        db.query(WishlistItem)
        .filter(
            WishlistItem.user_id == user_id,
            WishlistItem.listing_id == listing_id,
        )
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()
        return WishlistToggleOut(listing_id=listing_id, is_wishlisted=False)

    db.add(WishlistItem(user_id=user_id, listing_id=listing_id))
    db.commit()
    return WishlistToggleOut(listing_id=listing_id, is_wishlisted=True)


@router.get("/listings/{listing_id}/reviews", response_model=list[ReviewOut])
def get_listing_reviews(listing_id: int, db: Session = Depends(get_db)):
    reviews = (
        db.query(Review)
        .options(joinedload(Review.author))
        .filter(Review.listing_id == listing_id)
        .order_by(Review.created_at.desc())
        .all()
    )
    return [
        ReviewOut(
            id=review.id,
            rating=review.rating,
            comment=review.comment,
            created_at=review.created_at,
            author=HostOut.model_validate(review.author),
        )
        for review in reviews
    ]
