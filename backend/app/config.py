import os
from pathlib import Path

# Base directory of the backend project
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables manually if .env exists
env_path = BASE_DIR / ".env"
if env_path.exists():
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                key, val = line.split("=", 1)
                os.environ.setdefault(key.strip(), val.strip())

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/illegal_sand_mining"
)

API_PREFIX = os.getenv("API_PREFIX", "/api")
AI_MODEL_PATH = os.getenv("AI_MODEL_PATH", str(BASE_DIR.parent / "ai" / "sand_mining_model.keras"))
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "*"
]
