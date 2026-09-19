# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from app.config import API_PREFIX, CORS_ORIGINS
from app.api import api_router
from app.database import engine, Base
from app.seed import seed_database

# Ensure database tables and initial seed data exist
try:
    Base.metadata.create_all(bind=engine)
    seed_database()
except Exception as e:
    print(f"[Main Startup Warning] Could not auto-seed database: {e}")

app = FastAPI(
    title="Illegal Sand Mining Detection API",
    description="Backend decision-support API for satellite imagery change detection & riverbed mining monitoring.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(api_router, prefix=API_PREFIX)


@app.get("/")
def home():
    return {
        "message": "Illegal Sand Mining Detection API is running",
        "docs_url": "/docs",
        "api_health": "/api/health"
    }
