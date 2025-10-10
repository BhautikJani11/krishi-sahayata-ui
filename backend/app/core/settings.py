from functools import lru_cache
from pydantic import BaseSettings, Field
from typing import List

class Settings(BaseSettings):
    environment: str = Field(default="development")
    cors_allow_origins: List[str] = Field(default_factory=lambda: ["*"])
    openweather_api_key: str | None = None
    model_provider: str = Field(default="mock")  # mock|openai|anthropic etc.

    class Config:
        env_prefix = "FARMER_"
        case_sensitive = False

@lru_cache
def get_settings() -> "Settings":
    return Settings()