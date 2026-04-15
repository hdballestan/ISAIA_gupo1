import json
from datetime import date
from pathlib import Path

from sqlalchemy.orm import Session

from app.db.database import SessionLocal, create_tables
from app.models.certificate import Certificate
from app.models.user import User


CATALOG_PATH = Path(__file__).resolve().parents[3] / "data" / "catalog.json"


def _load_catalog() -> list[dict]:
    with CATALOG_PATH.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return data["certificates"]


def _parse_date(value: str | None) -> date | None:
    if not value:
        return None
    return date.fromisoformat(value)


def seed_certificates(db: Session) -> int:
    if db.query(Certificate).count() > 0:
        return 0

    entries = _load_catalog()
    for entry in entries:
        cert = Certificate(
            name=entry["name"],
            issuer=entry["issuer"],
            purposes=entry["purposes"],
            legal_basis=entry["legal_basis"],
            requirements=entry["requirements"],
            portal_url=entry["portal_url"],
            estimated_days=entry.get("estimated_days"),
            validity_days=entry.get("validity_days"),
            is_mandatory_for_minors=entry.get("is_mandatory_for_minors", False),
            practical_notes=entry.get("practical_notes", []),
            regex_patterns=entry.get("regex_patterns", []),
            last_verified=_parse_date(entry.get("last_verified")),
        )
        db.add(cert)

    db.commit()
    return len(entries)


def seed_admin(db: Session) -> bool:
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    if db.query(User).filter(User.role == "admin").count() > 0:
        return False

    admin = User(
        email="admin@certidoc.co",
        hashed_password=pwd_context.hash("admin_change_in_prod"),
        role="admin",
    )
    db.add(admin)
    db.commit()
    return True


def run_seed() -> None:
    create_tables()
    db = SessionLocal()
    try:
        certs = seed_certificates(db)
        admin = seed_admin(db)
        print(f"Seed: {certs} certificados, admin={'creado' if admin else 'ya existe'}")
    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
