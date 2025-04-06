from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "ToDo App"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = "sqlite:///./database.db"
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173"]

    class Config:
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()
