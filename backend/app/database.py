import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import DATABASE_URL

Base = declarative_base()

# Configure SQLAlchemy engine using PostgreSQL DATABASE_URL
print(f"[Database] Initializing SQLAlchemy engine with DATABASE_URL: {DATABASE_URL}")

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
