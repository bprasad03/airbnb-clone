# Airbnb Clone — SDE Fullstack Assignment

A functional clone of the Airbnb web application built with **Next.js (TypeScript)** and **FastAPI (Python)**, featuring browse/search/booking workflows, host listing management, and an UI closely modeled after [airbnb.co.in](https://www.airbnb.co.in/).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | SQLite |
| Date picker | react-day-picker |

## Project Structure

```
airbnb-clone/
├── frontend/          # Next.js app
│   └── src/
│       ├── app/       # Pages (home, listing detail, trips, host, etc.)
│       ├── components/
│       ├── context/   # App state, toasts, demo user switching
│       └── lib/       # API client & types
├── backend/
│   └── app/
│       ├── models.py      # SQLAlchemy models
│       ├── schemas.py     # Pydantic schemas
│       ├── seed.py        # Sample data
│       └── routers/       # API routes
└── README.md
```

## Features

### Guest Experience
- Home/explore grid with listing cards (photo, title, location, price, rating)
- Search bar (location, date range, guests)
- Category filter row + price filters
- Pagination
- Listing detail page with photo gallery, amenities, reviews, static map
- Date-range booking with availability validation
- Price breakdown (nightly × nights + cleaning + service fees)
- Mock checkout & confirmation
- My Trips view
- Wishlist / favorites

### Host Experience
- Full CRUD for listings (create, edit, delete)
- Host dashboard with owned listings and incoming bookings
- Photo URLs and amenity selection

### Demo Authentication
Real auth is mocked. Switch between demo users via the profile menu:
- **Priya (Guest)** — id 1, has trips & wishlist
- **Rajesh (Host)** — id 2, superhost with listings
- **Ananya (Host)** — id 3, superhost with listings

User context is sent via `X-User-Id` header.

## Database Schema

```
users
  id, name, email, avatar_url, is_host, is_superhost, created_at

listings
  id, host_id → users, title, description, location, city, country,
  latitude, longitude, price_per_night, property_type, max_guests,
  bedrooms, beds, baths, rating, review_count, cleaning_fee,
  service_fee_percent, created_at

listing_photos
  id, listing_id → listings, url, sort_order

listing_amenities
  id, listing_id → listings, name

bookings
  id, listing_id → listings, guest_id → users, check_in, check_out,
  guests, nightly_rate, cleaning_fee, service_fee, total_price,
  status, created_at

reviews
  id, listing_id → listings, user_id → users, booking_id → bookings,
  rating, comment, created_at

wishlist_items
  id, user_id → users, listing_id → listings, created_at
  UNIQUE(user_id, listing_id)
```

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/listings` | Search listings (filters, pagination) |
| GET | `/api/listings/categories` | Property type categories |
| GET | `/api/listings/{id}` | Listing detail |
| GET | `/api/listings/{id}/availability` | Booked date ranges |
| GET | `/api/listings/{id}/price` | Price breakdown |
| POST | `/api/listings` | Create listing (host) |
| PUT | `/api/listings/{id}` | Update listing |
| DELETE | `/api/listings/{id}` | Delete listing |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/my-trips` | Guest trips |
| GET | `/api/bookings/host` | Host bookings |
| GET | `/api/users/me` | Current user |
| GET | `/api/users/me/listings` | Host listings |
| GET | `/api/wishlist` | User wishlist |
| POST | `/api/wishlist/{id}` | Toggle wishlist |
| GET | `/api/listings/{id}/reviews` | Listing reviews |

## Setup & Run

### Prerequisites
- Python 3.11+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

The database (`airbnb.db`) is created and seeded automatically on first startup with 12 Indian listings, 4 users, sample bookings, and reviews.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:3000

Set `NEXT_PUBLIC_API_URL` in `frontend/.env.local` if the backend runs elsewhere.

## Assumptions

- **Payments** are mocked — checkout shows confirmation without charging
- **Authentication** uses demo user switching (no login/signup)
- **Maps** use a static fallback image (no Google Maps API key required)
- **Images** are loaded from Unsplash URLs (no upload to cloud storage)
- **Messaging, identity verification, experiences** are omitted (placeholder-ready)
- All prices are in **INR (₹)** to match airbnb.co.in

## Deployment

- **Frontend**: Deploy `frontend/` to [Vercel](https://vercel.com) — set `NEXT_PUBLIC_API_URL` to your backend URL
- **Backend**: Deploy `backend/` to [Railway](https://railway.app) or [Render](https://render.com) — use persistent disk for SQLite or swap to PostgreSQL

## License

Built as an original assignment submission. Not affiliated with Airbnb, Inc.
