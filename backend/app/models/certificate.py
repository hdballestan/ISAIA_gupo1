from datetime import datetime, date
from typing import Optional
from sqlalchemy import JSON, Boolean, Date, DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    issuer: Mapped[str] = mapped_column(String(255), nullable=False)
    purposes: Mapped[list] = mapped_column(JSON, default=list)
    legal_basis: Mapped[list] = mapped_column(JSON, default=list)
    requirements: Mapped[list] = mapped_column(JSON, default=list)
    portal_url: Mapped[str] = mapped_column(String(500), nullable=False)
    estimated_days: Mapped[Optional[int]] = mapped_column(nullable=True)
    validity_days: Mapped[Optional[int]] = mapped_column(nullable=True)
    is_mandatory_for_minors: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False
    )
    practical_notes: Mapped[list] = mapped_column(JSON, default=list)
    regex_patterns: Mapped[list] = mapped_column(JSON, default=list)
    last_verified: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
