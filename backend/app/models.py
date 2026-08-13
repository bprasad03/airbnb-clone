from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    is_host: Mapped[bool] = mapped_column(Boolean, default=False)
    is_superhost: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    listings: Mapped[list["Listing"]] = relationship(back_populates="host")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="guest")
    reviews: Mapped[list["Review"]] = relationship(back_populates="author")
    wishlist_items: Mapped[list["WishlistItem"]] = relationship(back_populates="user")


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    host_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(120), nullable=False)
    country: Mapped[str] = mapped_column(String(120), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, default=0.0)
    longitude: Mapped[float] = mapped_column(Float, default=0.0)
    price_per_night: Mapped[float] = mapped_column(Float, nullable=False)
    property_type: Mapped[str] = mapped_column(String(80), nullable=False)
    max_guests: Mapped[int] = mapped_column(Integer, default=2)
    bedrooms: Mapped[int] = mapped_column(Integer, default=1)
    beds: Mapped[int] = mapped_column(Integer, default=1)
    baths: Mapped[int] = mapped_column(Integer, default=1)
    rating: Mapped[float] = mapped_column(Float, default=0.0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    cleaning_fee: Mapped[float] = mapped_column(Float, default=0.0)
    service_fee_percent: Mapped[float] = mapped_column(Float, default=14.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    host: Mapped["User"] = relationship(back_populates="listings")
    photos: Mapped[list["ListingPhoto"]] = relationship(
        back_populates="listing", cascade="all, delete-orphan"
    )
    amenities: Mapped[list["ListingAmenity"]] = relationship(
        back_populates="listing", cascade="all, delete-orphan"
    )
    bookings: Mapped[list["Booking"]] = relationship(back_populates="listing")
    reviews: Mapped[list["Review"]] = relationship(back_populates="listing")
    wishlist_items: Mapped[list["WishlistItem"]] = relationship(back_populates="listing")


class ListingPhoto(Base):
    __tablename__ = "listing_photos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    listing: Mapped["Listing"] = relationship(back_populates="photos")


class ListingAmenity(Base):
    __tablename__ = "listing_amenities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)

    listing: Mapped["Listing"] = relationship(back_populates="amenities")


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False)
    guest_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    check_in: Mapped[date] = mapped_column(Date, nullable=False)
    check_out: Mapped[date] = mapped_column(Date, nullable=False)
    guests: Mapped[int] = mapped_column(Integer, default=1)
    nightly_rate: Mapped[float] = mapped_column(Float, nullable=False)
    cleaning_fee: Mapped[float] = mapped_column(Float, default=0.0)
    service_fee: Mapped[float] = mapped_column(Float, default=0.0)
    total_price: Mapped[float] = mapped_column(Float, nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="confirmed")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    listing: Mapped["Listing"] = relationship(back_populates="bookings")
    guest: Mapped["User"] = relationship(back_populates="bookings")
    review: Mapped["Review | None"] = relationship(back_populates="booking", uselist=False)


class Review(Base):
    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    booking_id: Mapped[int | None] = mapped_column(ForeignKey("bookings.id"))
    rating: Mapped[int] = mapped_column(Integer, nullable=False)
    comment: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    listing: Mapped["Listing"] = relationship(back_populates="reviews")
    author: Mapped["User"] = relationship(back_populates="reviews")
    booking: Mapped["Booking | None"] = relationship(back_populates="review")


class WishlistItem(Base):
    __tablename__ = "wishlist_items"
    __table_args__ = (UniqueConstraint("user_id", "listing_id", name="uq_wishlist"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    listing_id: Mapped[int] = mapped_column(ForeignKey("listings.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="wishlist_items")
    listing: Mapped["Listing"] = relationship(back_populates="wishlist_items")
