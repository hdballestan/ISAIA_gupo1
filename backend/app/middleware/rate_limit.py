from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.ticket import RateLimitEntry


def _as_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def enforce_ticket_rate_limit(
    db: Session,
    ip_address: str,
    endpoint: str = "/api/v1/tickets",
) -> None:
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=24)
    entry = (
        db.query(RateLimitEntry)
        .filter(
            RateLimitEntry.ip_address == ip_address,
            RateLimitEntry.endpoint == endpoint,
        )
        .first()
    )
    if entry and _as_utc(entry.last_request) > cutoff:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Ya enviaste una solicitud en las ultimas 24 horas",
        )
    if not entry:
        entry = RateLimitEntry(ip_address=ip_address, endpoint=endpoint)
        db.add(entry)
    entry.last_request = now
    db.commit()
