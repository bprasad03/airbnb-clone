from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, SessionLocal, engine
from .routers import bookings, listings, users
from .seed import seed_database

Base.metadata.create_all(bind=engine)

with SessionLocal() as db:
    seed_database(db)

app = FastAPI(title="Airbnb Clone API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(listings.router, prefix="/api")
app.include_router(bookings.router, prefix="/api")
app.include_router(users.router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
