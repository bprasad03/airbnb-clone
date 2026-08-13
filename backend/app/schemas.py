from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    name: str
    email: str
    avatar_url: str | None = None
    is_host: bool = False
    is_superhost: bool = False


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ListingPhotoOut(BaseModel):
    id: int
    url: str
    sort_order: int

    model_config = ConfigDict(from_attributes=True)


class ListingAmenityOut(BaseModel):
    id: int
    name: str

    model_config = ConfigDict(from_attributes=True)


class HostOut(BaseModel):
    id: int
    name: str
    avatar_url: str | None
    is_superhost: bool

    model_config = ConfigDict(from_attributes=True)


class ListingBase(BaseModel):
    title: str
    description: str
    location: str
    city: str
    country: str
    latitude: float = 0.0
    longitude: float = 0.0
    price_per_night: float = Field(gt=0)
    property_type: str
    max_guests: int = Field(ge=1)
    bedrooms: int = Field(ge=0)
    beds: int = Field(ge=1)
    baths: int = Field(ge=1)
    cleaning_fee: float = Field(ge=0, default=0)
    service_fee_percent: float = Field(ge=0, default=14.0)


class ListingCreate(ListingBase):
    photo_urls: list[str] = []
    amenities: list[str] = []


class ListingUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    location: str | None = None
    city: str | None = None
    country: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    price_per_night: float | None = Field(default=None, gt=0)
    property_type: str | None = None
    max_guests: int | None = Field(default=None, ge=1)
    bedrooms: int | None = Field(default=None, ge=0)
    beds: int | None = Field(default=None, ge=1)
    baths: int | None = Field(default=None, ge=1)
    cleaning_fee: float | None = Field(default=None, ge=0)
    service_fee_percent: float | None = Field(default=None, ge=0)
    photo_urls: list[str] | None = None
    amenities: list[str] | None = None


class ListingCardOut(BaseModel):
    id: int
    title: str
    location: str
    city: str
    country: str
    price_per_night: float
    property_type: str
    rating: float
    review_count: int
    cover_photo: str | None
    is_wishlisted: bool = False

    model_config = ConfigDict(from_attributes=True)


class ListingDetailOut(ListingBase):
    id: int
    rating: float
    review_count: int
    host: HostOut
    photos: list[ListingPhotoOut]
    amenities: list[ListingAmenityOut]
    is_wishlisted: bool = False
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ReviewOut(BaseModel):
    id: int
    rating: int
    comment: str
    created_at: datetime
    author: HostOut

    model_config = ConfigDict(from_attributes=True)


class BookingCreate(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    guests: int = Field(ge=1)


class BookingOut(BaseModel):
    id: int
    listing_id: int
    guest_id: int
    check_in: date
    check_out: date
    guests: int
    nightly_rate: float
    cleaning_fee: float
    service_fee: float
    total_price: float
    status: str
    created_at: datetime
    listing_title: str | None = None
    listing_photo: str | None = None
    listing_location: str | None = None

    model_config = ConfigDict(from_attributes=True)


class PriceBreakdown(BaseModel):
    nights: int
    nightly_rate: float
    subtotal: float
    cleaning_fee: float
    service_fee: float
    total: float


class AvailabilityOut(BaseModel):
    booked_ranges: list[dict[str, date]]
    min_nights: int = 1


class WishlistToggleOut(BaseModel):
    listing_id: int
    is_wishlisted: bool


class PaginatedListings(BaseModel):
    items: list[ListingCardOut]
    total: int
    page: int
    page_size: int
    total_pages: int
