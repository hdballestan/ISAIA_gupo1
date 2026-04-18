from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.middleware.auth import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


class AuthRequest(BaseModel):
    email: str = Field(min_length=5, max_length=255)
    password: str = Field(min_length=8, max_length=128)


class AuthResponse(BaseModel):
    access_token: str
    token_type: str
    role: str


def _normalize_email(email: str) -> str:
    return email.strip().lower()


@router.post(
    "/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED
)
def register(payload: AuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
    email = _normalize_email(payload.email)
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya esta registrado")
    user = User(
        email=email, hashed_password=hash_password(payload.password), role="citizen"
    )
    db.add(user)
    db.commit()
    token = create_access_token(user.email, user.role)
    return AuthResponse(access_token=token, token_type="bearer", role=user.role)


@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest, db: Session = Depends(get_db)) -> AuthResponse:
    email = _normalize_email(payload.email)
    user = db.query(User).filter(User.email == email).first()
    valid = user and verify_password(payload.password, user.hashed_password)
    if not valid:
        raise HTTPException(status_code=401, detail="Credenciales invalidas")
    token = create_access_token(user.email, user.role)
    return AuthResponse(access_token=token, token_type="bearer", role=user.role)
