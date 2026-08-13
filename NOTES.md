# Submission Notes

## Assumptions
* **Search Functionality:** Location search relies on frontend substring matching against our predefined list rather than a full geolocation API (like Google Maps or Mapbox).
* **Authentication:** User authentication is bypassed or mocked for this iteration. Features like wishlisting are visually represented but not tied to a secure user session.
* **Component Architecture:** The Search Bar component manages its own complex state internally (for guests, dates, and locations) and bubbles the aggregate values up to the parent `page.tsx` for fetching data.

## Mocked Data
* **Grid Content (`frontend/src/lib/mockData.ts`):** To ensure the application looks visually complete immediately upon load, we use mocked arrays for Homes, Experiences, and Services. This avoids the need for the evaluator to manually seed the database with dozens of high-quality listings.
* **Placeholder Images:** All card images use reliable static placeholders via `picsum.photos` with locked aspect ratios (`aspect-square`). This guarantees images will never 404 (which frequently happens with Unsplash source URLs) and that the grid remains perfectly aligned.
* **Search Suggestions:** The "Where" dropdown is prepopulated with dummy Indian destinations (Chandigarh, Goa, etc.) and a functional "Nearby" option.

## Technical Notes
* **Monorepo Structure:** The project houses both the Next.js (TypeScript + TailwindCSS) frontend and FastAPI (Python + SQLAlchemy) backend in a single repository.
* **Deployment Configuration:** A `zeabur.json` file is included at the root to allow for instant, zero-config deployment on Zeabur. The rewrite rules proxy `/api/backend/*` directly to the FastAPI service, bypassing any CORS complexities in production.
* **Python Environment:** A `.python-version` file (set to `3.12.4`) is included in the backend. This explicitly prevents cloud platforms (like Render) from defaulting to Python 3.14+, which currently lacks pre-compiled wheels for `pydantic-core` and causes Rust compilation errors.
* **Design System:** The UI strictly follows the modern Airbnb design language (Bélo logo, Inter font replacing Circular, #FF385C primary color, pill-shaped sticky search bars, and soft drop shadows).
