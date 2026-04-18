from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.middleware.auth import require_roles
from app.models.certificate import Certificate
from app.models.ticket import TicketRequest
from app.routes.certificates import (
    CertificateCreateRequest,
    CertificateResponse,
    _apply_certificate_payload,
)
from app.services.catalog import serialize_certificate

router = APIRouter(prefix="/api/v1/admin", tags=["admin"])


class AdminTicketResponse(BaseModel):
    id: int
    description: str
    submitter_ip: str
    status: str
    admin_notes: str | None
    created_at: datetime
    resolved_at: datetime | None


class AdminTicketUpdateRequest(BaseModel):
    status: str = Field(pattern="^(pending|approved|rejected)$")
    admin_notes: str = Field(default="", max_length=2000)


@router.get("/tickets", response_model=list[AdminTicketResponse])
def list_tickets(
    _: object = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
) -> list[AdminTicketResponse]:
    tickets = db.query(TicketRequest).order_by(TicketRequest.created_at.desc()).all()
    return [
        AdminTicketResponse.model_validate(ticket, from_attributes=True)
        for ticket in tickets
    ]


@router.put("/tickets/{ticket_id}", response_model=AdminTicketResponse)
def update_ticket(
    ticket_id: int,
    payload: AdminTicketUpdateRequest,
    _: object = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
) -> AdminTicketResponse:
    ticket = db.query(TicketRequest).filter(TicketRequest.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    ticket.status = payload.status
    ticket.admin_notes = payload.admin_notes or None
    ticket.resolved_at = (
        datetime.now(timezone.utc) if payload.status != "pending" else None
    )
    db.commit()
    db.refresh(ticket)
    return AdminTicketResponse.model_validate(ticket, from_attributes=True)


@router.post("/certificates", response_model=CertificateResponse)
def create_certificate(
    payload: CertificateCreateRequest,
    _: object = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
) -> CertificateResponse:
    certificate = Certificate()
    _apply_certificate_payload(certificate, payload)
    db.add(certificate)
    db.commit()
    db.refresh(certificate)
    return CertificateResponse(**serialize_certificate(certificate))


@router.put("/certificates/{certificate_id}", response_model=CertificateResponse)
def update_certificate(
    certificate_id: int,
    payload: CertificateCreateRequest,
    _: object = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
) -> CertificateResponse:
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificado no encontrado")
    _apply_certificate_payload(certificate, payload)
    db.commit()
    db.refresh(certificate)
    return CertificateResponse(**serialize_certificate(certificate))


@router.delete("/certificates/{certificate_id}")
def delete_certificate(
    certificate_id: int,
    _: object = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
) -> dict[str, str]:
    certificate = db.query(Certificate).filter(Certificate.id == certificate_id).first()
    if not certificate:
        raise HTTPException(status_code=404, detail="Certificado no encontrado")
    db.delete(certificate)
    db.commit()
    return {"status": "deleted"}
