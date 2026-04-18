from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables() -> None:
    from app.db.base import Base
    from app.models.certificate import Certificate
    from app.models.ticket import RateLimitEntry, TicketRequest
    from app.models.user import User

    _ = (Certificate, User, TicketRequest, RateLimitEntry)
    Base.metadata.create_all(bind=engine)
