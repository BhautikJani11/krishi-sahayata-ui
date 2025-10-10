import os
from functools import lru_cache


class Settings:
    """Application settings loaded from environment variables."""

    app_name: str = os.getenv("APP_NAME", "Farmer Assistant API")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")

    # Database
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./farmer.db")

    # AI Gateway
    lovable_ai_url: str = os.getenv(
        "LOVABLE_AI_URL", "https://ai.gateway.lovable.dev/v1/chat/completions"
    )
    lovable_api_key: str | None = os.getenv("LOVABLE_API_KEY")


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
