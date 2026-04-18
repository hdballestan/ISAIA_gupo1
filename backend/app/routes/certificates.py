from datetime import date, datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.config import settings
from app.db.database import get_db
from app.models.certificate import Certificate
from app.services.catalog import serialize_certificate
from app.services.virustotal import extract_result, fetch_url_report

router = APIRouter(prefix="/api/v1/certificates", tags=["certificates"])


class CertificateResponse(BaseModel):
    id: int
    name: str
    issuer: str
    purposes: list[str]
    legal_basis: list[str]
    requirements: list[str]
    portal_url: str
    estimated_days: Optional[int]
    validity_days: Optional[int]
    is_mandatory_for_minors: bool
    practical_notes: list[str]
    regex_patterns: list[str]
    last_verified: Optional[date]


class CertificateListResponse(BaseModel):
    items: list[CertificateResponse]
    total: int


class ThreatCheckResponse(BaseModel):
    threat_level: str
    note: Optional[str]
    last_scan: Optional[datetime]


class ThreatCheckRequest(BaseModel):
    portal_url: Optional[str] = None


def _purpose_match(cert: Certificate, purpose: str) -> bool:
    values = [item.lower() for item in cert.purposes or []]
    return purpose.lower() in values


@router.get("", response_model=CertificateListResponse)
def get_certificates(
    purpose: Optional[str] = Query(default=None, min_length=3, max_length=50),
    db: Session = Depends(get_db),
) -> CertificateListResponse:
    certificates = db.query(Certificate).order_by(Certificate.name.asc()).all()
    if purpose:
        certificates = [cert for cert in certificates if _purpose_match(cert, purpose)]
    items = [
        CertificateResponse(**serialize_certificate(cert)) for cert in certificates
    ]
    return CertificateListResponse(items=items, total=len(items))


@router.get("/{certificate_id}", response_model=CertificateResponse)
def get_certificate(
    certificate_id: int, db: Session = Depends(get_db)
) -> CertificateResponse:
    cert = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificado no encontrado")
    return CertificateResponse(**serialize_certificate(cert))


@router.post("/{certificate_id}/threat-check", response_model=ThreatCheckResponse)
def threat_check_certificate(
    certificate_id: int,
    payload: Optional[ThreatCheckRequest] = None,
    db: Session = Depends(get_db),
) -> ThreatCheckResponse:
    cert = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not cert:
        raise HTTPException(status_code=404, detail="Certificado no encontrado")
    target_url = (payload.portal_url if payload else None) or cert.portal_url
    if not target_url:
        return ThreatCheckResponse(
            threat_level="unavailable",
            note="Certificado sin portal URL",
            last_scan=datetime.now(timezone.utc),
        )
    report = fetch_url_report(target_url, settings.virustotal_api_key)
    result = extract_result(report)
    checked_at = datetime.now(timezone.utc)
    return ThreatCheckResponse(**result, last_scan=checked_at)


class CertificateCreateRequest(BaseModel):
    name: str = Field(min_length=3, max_length=255)
    issuer: str = Field(min_length=3, max_length=255)
    purposes: list[str] = Field(default_factory=list)
    legal_basis: list[str] = Field(default_factory=list)
    requirements: list[str] = Field(default_factory=list)
    portal_url: str = Field(min_length=10, max_length=500)
    estimated_days: Optional[int] = Field(default=None, ge=0)
    validity_days: Optional[int] = Field(default=None, ge=0)
    is_mandatory_for_minors: bool = False
    practical_notes: list[str] = Field(default_factory=list)
    regex_patterns: list[str] = Field(default_factory=list)
    last_verified: Optional[date] = None


def _apply_certificate_payload(
    cert: Certificate, payload: CertificateCreateRequest
) -> None:
    cert.name = payload.name
    cert.issuer = payload.issuer
    cert.purposes = payload.purposes
    cert.legal_basis = payload.legal_basis
    cert.requirements = payload.requirements
    cert.portal_url = payload.portal_url
    cert.estimated_days = payload.estimated_days
    cert.validity_days = payload.validity_days
    cert.is_mandatory_for_minors = payload.is_mandatory_for_minors
    cert.practical_notes = payload.practical_notes
    cert.regex_patterns = payload.regex_patterns
    cert.last_verified = payload.last_verified
