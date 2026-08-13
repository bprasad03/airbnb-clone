from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from ..database import get_db
from ..deps import get_current_user_id
from ..models import Booking, Listing
from ..schemas import BookingCreate, BookingOut

router = APIRouter(prefix="/bookings", tags=["bookings"])


def _dates_overlap(start1: date, end1: date, start2: date, end2: date) -> bool:
    return start1 < end2 and start2 < end1


def _booking_to_out(booking: Booking) -> BookingOut:
    cover = None
    if booking.listing and booking.listing.photos:
        cover = sorted(booking.listing.photos, key=lambda p: p.sort_order)[0].url

    return BookingOut(
        id=booking.id,
        listing_id=booking.listing_id,
        guest_id=booking.guest_id,
        check_in=booking.check_in,
        check_out=booking.check_out,
        guests=booking.guests,
        nightly_rate=booking.nightly_rate,
        cleaning_fee=booking.cleaning_fee,
        service_fee=booking.service_fee,
        total_price=booking.total_price,
        status=booking.status,
        created_at=booking.created_at,
        listing_title=booking.listing.title if booking.listing else None,
        listing_photo=cover,
        listing_location=booking.listing.location if booking.listing else None,
    )


@router.post("", response_model=BookingOut, status_code=201)
def create_booking(
    payload: BookingCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    listing = db.query(Listing).filter(Listing.id == payload.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if payload.check_out <= payload.check_in:
        raise HTTPException(status_code=400, detail="Check-out must be after check-in")

    if payload.check_in < date.today():
        raise HTTPException(status_code=400, detail="Check-in cannot be in the past")

    if payload.guests > listing.max_guests:
        raise HTTPException(
            status_code=400,
            detail=f"Maximum {listing.max_guests} guests allowed",
        )

    existing = (
        db.query(Booking)
        .filter(
            Booking.listing_id == payload.listing_id,
            Booking.status == "confirmed",
        )
        .all()
    )
    for booking in existing:
        if _dates_overlap(
            payload.check_in, payload.check_out, booking.check_in, booking.check_out
        ):
            raise HTTPException(
                status_code=409,
                detail="Selected dates overlap with an existing booking",
            )

    nights = (payload.check_out - payload.check_in).days
    subtotal = nights * listing.price_per_night
    service_fee = round(subtotal * listing.service_fee_percent / 100, 2)
    total = subtotal + listing.cleaning_fee + service_fee

    booking = Booking(
        listing_id=listing.id,
        guest_id=user_id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        guests=payload.guests,
        nightly_rate=listing.price_per_night,
        cleaning_fee=listing.cleaning_fee,
        service_fee=service_fee,
        total_price=total,
        status="confirmed",
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    booking = (
        db.query(Booking)
        .options(joinedload(Booking.listing).joinedload(Listing.photos))
        .filter(Booking.id == booking.id)
        .first()
    )
    return _booking_to_out(booking)


@router.get("/my-trips", response_model=list[BookingOut])
def get_my_trips(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.listing).joinedload(Listing.photos))
        .filter(Booking.guest_id == user_id)
        .order_by(Booking.check_in.desc())
        .all()
    )
    return [_booking_to_out(b) for b in bookings]


@router.get("/host", response_model=list[BookingOut])
def get_host_bookings(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    bookings = (
        db.query(Booking)
        .join(Listing)
        .options(joinedload(Booking.listing).joinedload(Listing.photos))
        .filter(Listing.host_id == user_id)
        .order_by(Booking.check_in.desc())
        .all()
    )
    return [_booking_to_out(b) for b in bookings]
