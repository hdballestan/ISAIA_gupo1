import sys
import time
from datetime import datetime, timezone, timedelta

from sqlalchemy.orm import Session

from app.config import settings
from app.db.database import SessionLocal, engine
from app.models.certificate import Certificate
from app.db.base import Base
from app.services.virustotal import fetch_url_report, extract_result


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


def scan_all_urls() -> None:
    init_db()
    db: Session = SessionLocal()

    try:
        certs = db.query(Certificate).filter(
            Certificate.portal_url.isnot(None)
        ).all()

        if not certs:
            print("No certificates found.")
            return

        cutoff = datetime.now(timezone.utc) - timedelta(days=7)
        to_scan = [
            c for c in certs
            if c.vt_last_scan is None or c.vt_last_scan < cutoff
        ]

        if not to_scan:
            print("All URLs scanned recently. Exiting.")
            return

        print(f"Scanning {len(to_scan)} URLs...")

        for cert in to_scan:
            try:
                vt_response = fetch_url_report(
                    cert.portal_url, settings.virustotal_api_key
                )
                result = extract_result(vt_response)

                cert.vt_threat_level = result["threat_level"]
                cert.vt_note = result.get("note")
                cert.vt_last_scan = datetime.now(timezone.utc)

                db.commit()
                print(f"✓ {cert.name}: {result['threat_level']}")

            except Exception as e:
                print(f"✗ {cert.name}: {str(e)}")
                cert.vt_threat_level = "unknown"
                cert.vt_last_scan = datetime.now(timezone.utc)
                db.commit()

            time.sleep(1)

        print("Done.")

    finally:
        db.close()


if __name__ == "__main__":
    scan_all_urls()
