import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Fake News Detection System"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "supersecret_jwt_signing_key_change_in_production_btech_2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # SQLite Database URL
    DATABASE_URL: str = "sqlite:///./fake_news.db"
    
    # CORS Allowed Origins
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173"
    
    # Rate Limiting & Safeguards
    RATE_LIMIT_PER_MINUTE: int = 60
    MAX_TEXT_LENGTH: int = 100000

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "allow"


settings = Settings()
