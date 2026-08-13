import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "QuickDine API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # MongoDB Config
    MONGO_URL: str = os.getenv("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.getenv("DB_NAME", "quickdine")
    MONGO_TIMEOUT_MS: int = 2000
    
    # CORS Settings
    CORS_ORIGINS: list[str] = ["*"]

settings = Settings()
