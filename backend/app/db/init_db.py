from sqlmodel import SQLModel, create_engine
from app.core.settings import get_settings

settings = get_settings()
engine = create_engine(settings.DATABASE_URL, echo=True)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
