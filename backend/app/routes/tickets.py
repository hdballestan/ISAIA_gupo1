from fastapi import APIRouter, Depends, Request, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.middleware.rate_limit import enforce_ticket_rate_limit
from app.models.ticket import TicketRequest

router = APIRouter(prefix="/api/v1/tickets", tags=["tickets"])


class TicketCreateRequest(BaseModel):
    description: str = Field(min_length=10, max_length=5000)
    honeypot: str = ""


class TicketCreateResponse(BaseModel):
    id: int
    status: str
    message: str


def _client_ip(request: Request) -> str:
    if request.client:
        return request.client.host
    return "0.0.0.0"


@router.post(
    "", response_model=TicketCreateResponse, status_code=status.HTTP_201_CREATED
)
def create_ticket(
    payload: TicketCreateRequest,
    request: Request,
    db: Session = Depends(get_db),
) -> TicketCreateResponse:
    if payload.honeypot.strip():
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"id": 0, "status": "received", "message": "Solicitud recibida"},
        )
    ip_address = _client_ip(request)
    enforce_ticket_rate_limit(db, ip_address)
    ticket = TicketRequest(
        description=payload.description.strip(), submitter_ip=ip_address
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return TicketCreateResponse(
        id=ticket.id, status=ticket.status, message="Ticket creado"
    )
