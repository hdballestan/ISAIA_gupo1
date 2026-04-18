from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.certificate import Certificate
from app.services.catalog import serialize_certificate
from app.services.matcher import match_certificates

router = APIRouter(prefix="/api/v1/extract", tags=["extract"])


class ExtractRequest(BaseModel):
    text: str = Field(min_length=1, max_length=300000)


class ExtractResponse(BaseModel):
    matches: list[dict]
    total: int


@router.post("", response_model=ExtractResponse)
def extract_certificates(
    payload: ExtractRequest,
    db: Session = Depends(get_db),
) -> ExtractResponse:
    certificates = db.query(Certificate).all()
    catalog = [serialize_certificate(cert) for cert in certificates]
    matches = match_certificates(payload.text, catalog)
    return ExtractResponse(matches=matches, total=len(matches))
